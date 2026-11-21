"""
Gemini LLM Integration Service for SchemeSathi.

Provides:
- Attribute extraction from natural language (Hindi/English/Hinglish) → structured UserProfile
- Natural empathetic response generation from evaluation results
- Follow-up question generation for missing criteria
- Multi-turn conversation memory support
"""

import json
import logging
from typing import List, Dict, Any, Optional

from google import genai
from google.genai import types

from app.config import get_settings
from app.models.profile import UserProfile
from app.models.scheme import EvaluationResponse

logger = logging.getLogger("schemesathi.llm")

# ─── System Prompts ──────────────────────────────────────────────────────────

EXTRACTION_SYSTEM_PROMPT = """You are SchemeSathi (योजना साथी), a compassionate AI assistant that helps Indian citizens 
discover government welfare schemes they are eligible for.

Your task: Extract structured citizen profile attributes from the user's natural spoken input.
The user may speak in Hindi, English, or Hinglish (mixed). Handle all three naturally.

**Unit Conversions (apply automatically):**
- 1 बीघा ≈ 0.25 hectares
- 1 कनाल ≈ 0.05 hectares  
- 1 एकड़ (acre) ≈ 0.4 hectares
- Always convert land area to hectares in the output.

**Income Mapping:**
- "Below 1 lakh" / "1 लाख से कम" → annual_income: 75000
- "1 to 2.5 lakh" / "1 से 2.5 लाख" → annual_income: 180000
- "Above 2.5 lakh" / "2.5 लाख से अधिक" → annual_income: 350000
- If they say a specific number, use it directly.

**Occupation Normalization:**
- किसान / farmer / kisan → "Farmer"
- छात्र / student / vidyarthi → "Student"  
- महिला / woman / female → "Woman"
- वृद्ध / बुजुर्ग / senior → "Senior citizen"
- मज़दूर / worker / labour / श्रमिक → "Worker"
- व्यापारी / business / vendor / दुकान → "Small business"

**Rules:**
- Only extract information the user has actually stated. Do NOT infer or guess.
- If the user has not mentioned a field, leave it as null.
- For raw_attributes, store any additional details the user mentions that don't map to structured fields.
- Be tolerant of spelling errors and colloquial Hindi.
"""

RESPONSE_SYSTEM_PROMPT = """You are SchemeSathi (योजना साथी), a warm and empathetic AI assistant.
Generate a natural conversational response to share eligibility results with the citizen.

**Guidelines:**
- Match the user's language (Hindi, English, or Hinglish as detected).
- Be warm, respectful, and encouraging.
- Highlight eligible schemes first with their key benefits.
- For schemes needing more info, explain what's missing in simple terms.
- Keep it concise — this will be spoken aloud by a voice agent.
- Use simple language accessible to rural citizens.
- Do NOT use markdown, bullet points, or any formatting — plain spoken text only.
- Address the user respectfully (आप/आपके).
"""

FOLLOWUP_SYSTEM_PROMPT = """You are SchemeSathi (योजना साथी). Based on the missing criteria from the eligibility evaluation,
generate ONE clear, simple follow-up question to gather the most important missing information.

**Guidelines:**
- Ask about the single most impactful missing attribute (the one that affects the most schemes).
- Use the same language the user has been speaking (Hindi/English/Hinglish).
- Keep the question short and conversational — it will be spoken aloud.
- Include 2-3 suggested answer options when appropriate.
- Be warm and polite.
"""


class LLMService:
    """Gemini-powered LLM service for SchemeSathi voice agent."""

    def __init__(self):
        settings = get_settings()
        self._api_key = settings.GEMINI_API_KEY
        self._client: Optional[genai.Client] = None

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            if not self._api_key:
                raise RuntimeError("GEMINI_API_KEY is not configured")
            self._client = genai.Client(api_key=self._api_key)
        return self._client

    @property
    def available(self) -> bool:
        return bool(self._api_key)

    # ─── Attribute Extraction ─────────────────────────────────────────────

    async def extract_profile(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        existing_profile: Optional[UserProfile] = None,
    ) -> UserProfile:
        """
        Extract structured UserProfile attributes from natural language input.
        Uses Gemini structured output with the UserProfile Pydantic schema.
        
        Args:
            user_message: The user's latest message (text from STT or typed).
            conversation_history: Previous messages for multi-turn context.
            existing_profile: Current accumulated profile to provide context.
            
        Returns:
            UserProfile with extracted (non-null) fields from this message.
        """
        if not self.available:
            logger.warning("Gemini not available, falling back to empty profile")
            return UserProfile()

        try:
            # Build conversation contents
            contents: List[types.Content] = []

            # Add conversation history for multi-turn context
            if conversation_history:
                for msg in conversation_history[-10:]:  # Last 10 messages max
                    role = "user" if msg.get("role") == "user" else "model"
                    contents.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=msg.get("content", ""))],
                        )
                    )

            # Build the extraction prompt with existing profile context
            extraction_prompt = f"User's latest message: \"{user_message}\""
            if existing_profile:
                profile_dict = existing_profile.model_dump(exclude_none=True)
                if profile_dict:
                    extraction_prompt += (
                        f"\n\nAlready known about this citizen (do NOT overwrite with null, "
                        f"only update if the user provides NEW information): {json.dumps(profile_dict, ensure_ascii=False)}"
                    )

            contents.append(
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=extraction_prompt)],
                )
            )

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=EXTRACTION_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=UserProfile,
                    temperature=0.1,
                ),
            )

            # Parse structured output
            if response.text:
                profile_data = json.loads(response.text)
                return UserProfile(**profile_data)

            logger.warning("Empty response from Gemini extraction")
            return UserProfile()

        except Exception as e:
            logger.error(f"Gemini extraction failed: {e}", exc_info=True)
            return UserProfile()

    # ─── Response Generation ──────────────────────────────────────────────

    async def generate_response(
        self,
        evaluation: EvaluationResponse,
        user_message: str,
        language: str = "en",
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Generate a natural, empathetic spoken response from evaluation results.
        
        Args:
            evaluation: The eligibility evaluation results.
            user_message: The user's original message for context.
            language: Response language ('en' or 'hi').
            conversation_history: Previous messages for tone continuity.
            
        Returns:
            Natural language response string suitable for TTS.
        """
        if not self.available:
            # Fallback to the engine's built-in spoken summary
            return evaluation.llm_spoken_summary or (
                "आपकी जानकारी की जाँच हो गई है।" if language == "hi"
                else "Your information has been evaluated."
            )

        try:
            # Build a compact results summary for the LLM
            results_summary = {
                "total_checked": evaluation.total_schemes_checked,
                "eligible": evaluation.eligible_count,
                "needs_info": evaluation.needs_info_count,
                "not_eligible": evaluation.not_eligible_count,
                "top_results": [
                    {
                        "name": r.name,
                        "status": r.status,
                        "passed": r.passed[:3],
                        "failed": r.failed[:2],
                        "missing": r.missing[:2],
                        "benefits": r.benefits[:200] if r.benefits else None,
                    }
                    for r in evaluation.results[:6]
                ],
            }

            lang_instruction = (
                "Respond in Hindi (Devanagari script)."
                if language == "hi"
                else "Respond in English."
            )

            prompt = (
                f"{lang_instruction}\n\n"
                f"The citizen said: \"{user_message}\"\n\n"
                f"Eligibility evaluation results:\n{json.dumps(results_summary, ensure_ascii=False, indent=2)}\n\n"
                f"Generate a warm, spoken response summarizing these results for the citizen."
            )

            contents = []
            if conversation_history:
                for msg in conversation_history[-6:]:
                    role = "user" if msg.get("role") == "user" else "model"
                    contents.append(
                        types.Content(
                            role=role,
                            parts=[types.Part.from_text(text=msg.get("content", ""))],
                        )
                    )

            contents.append(
                types.Content(role="user", parts=[types.Part.from_text(text=prompt)])
            )

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=RESPONSE_SYSTEM_PROMPT,
                    temperature=0.7,
                    max_output_tokens=500,
                ),
            )

            if response.text:
                return response.text.strip()

            # Fallback to engine summary
            return evaluation.llm_spoken_summary or ""

        except Exception as e:
            logger.error(f"Gemini response generation failed: {e}", exc_info=True)
            return evaluation.llm_spoken_summary or ""

    # ─── Follow-up Question Generation ────────────────────────────────────

    async def generate_followup_question(
        self,
        missing_fields: List[str],
        profile: UserProfile,
        language: str = "en",
    ) -> Optional[Dict[str, Any]]:
        """
        Generate a targeted follow-up question for the most important missing information.
        
        Args:
            missing_fields: List of missing criteria descriptions from evaluation.
            profile: Current known profile for context.
            language: Question language.
            
        Returns:
            Dict with 'question' and 'quick_replies' keys, or None if no question needed.
        """
        if not missing_fields or not self.available:
            return None

        try:
            known = profile.model_dump(exclude_none=True)
            known.pop("raw_attributes", None)

            lang_instruction = (
                "Ask the question in Hindi (Devanagari script)."
                if language == "hi"
                else "Ask the question in English."
            )

            prompt = (
                f"{lang_instruction}\n\n"
                f"Already known about this citizen: {json.dumps(known, ensure_ascii=False)}\n\n"
                f"Missing criteria that need verification:\n"
                + "\n".join(f"- {m}" for m in missing_fields[:5])
                + "\n\nGenerate ONE follow-up question to collect the most important missing information."
                  "\n\nRespond in this exact JSON format:"
                  '\n{{"question": "...", "quick_replies": ["option1", "option2", "option3"]}}'
            )

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=FOLLOWUP_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.5,
                    max_output_tokens=300,
                ),
            )

            if response.text:
                return json.loads(response.text)
            return None

        except Exception as e:
            logger.error(f"Gemini follow-up generation failed: {e}", exc_info=True)
            return None


# Global singleton
llm_service = LLMService()
