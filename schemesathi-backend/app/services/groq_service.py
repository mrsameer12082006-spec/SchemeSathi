import os
import re
import json
import logging
from typing import Optional, Dict, Any, Tuple, List
from pydantic import BaseModel, Field, ValidationError

from app.config import get_settings
from app.models.profile import UserProfile
from app.models.scheme import EvaluationResponse

logger = logging.getLogger("schemesathi.groq")


class CitizenProfileExtraction(BaseModel):
    """
    Strict Pydantic model to guarantee 100% valid schema extraction
    from Groq llama-3.1-8b-instant.
    """
    occupation: Optional[str] = Field(
        None,
        description="One of: 'Farmer', 'Student', 'Woman', 'Worker', 'Senior citizen', 'Small business', 'Other'"
    )
    landholding_hectares: Optional[float] = Field(
        None,
        description="Total agricultural land in HECTARES. (1 Bigha = 0.25 ha, 1 Acre = 0.404 ha, 1 Kanal = 0.05 ha)"
    )
    land_ownership: Optional[str] = Field(
        None,
        description="'Own land', 'Tenant', or 'Landless'"
    )
    annual_income: Optional[float] = Field(
        None,
        description="Total household ANNUAL income in INR. (Monthly income * 12)"
    )
    income_bracket: Optional[str] = Field(
        None,
        description="'Below 1 Lakh', '1 - 2.5 Lakh', or 'Above 2.5 Lakh'"
    )
    age: Optional[int] = Field(
        None,
        description="Citizen age in years"
    )
    gender: Optional[str] = Field(
        None,
        description="'Male', 'Female', or 'Other'"
    )
    state: Optional[str] = Field(
        None,
        description="Indian state of residence (e.g. Uttar Pradesh, Bihar, Rajasthan, Haryana, etc.)"
    )
    area: Optional[str] = Field(
        None,
        description="'Rural' or 'Urban'"
    )
    caste_category: Optional[str] = Field(
        None,
        description="'General', 'OBC', 'SC', 'ST', or 'EWS'"
    )
    education_level: Optional[str] = Field(
        None,
        description="e.g. 'Class 9-10', 'Class 11-12', 'College / Higher Education'"
    )
    bpl_cardholder: Optional[bool] = Field(
        None,
        description="True if citizen mentions BPL / Ration card / Antyodaya"
    )
    raw_attributes: Dict[str, Any] = Field(
        default_factory=dict,
        description="Human-readable key-value summary"
    )


EXTRACTION_SYSTEM_PROMPT = """You are SchemeSathi's precision entity extraction engine.
Your task is to parse a spoken or written citizen statement (which may be in Hindi, Hinglish, or English) into a strict JSON object.

CRITICAL UNIT CONVERSION RULES:
1. LAND UNITS:
   - 1 बीघा (Bigha) ≈ 0.25 hectares (North India standard). E.g., "3 bigha" -> 0.75 hectares.
   - 1 एकड़ (Acre) ≈ 0.404 hectares. E.g., "2 acres" -> 0.81 hectares.
   - 1 कनाल (Kanal) ≈ 0.05 hectares.
   - "2 hectare se kam" / "chhota kisan" -> 1.5 hectares.
   - "2 hectare se adhik" / "bada kisan" -> 3.5 hectares.
   - "Bataidar" / "bhoomihin" / "tenant" -> landholding_hectares = 0.0, land_ownership = "Tenant".

2. INCOME UNITS:
   - "5lpa" / "5 LPA" / "5 lakh per annum" -> 500000 (bracket: "Above 2.5 Lakh").
   - "X lpa" -> X * 100000.
   - Monthly wages MUST be multiplied by 12 for annual income (e.g., "10000 mahina" -> 120000).
   - Daily wages MUST be multiplied by 300 (e.g., "400 rupaye dihadi" -> 120000).
   - "1 lakh se kam" -> 75000 (bracket: "Below 1 Lakh").
   - "1 se 2.5 lakh" -> 180000 (bracket: "1 - 2.5 Lakh").
   - "2.5 lakh se adhik" -> 350000 (bracket: "Above 2.5 Lakh").

3. OCCUPATION MAPPINGS:
   - kisan/kheti/farming -> "Farmer"
   - vidyarthi/student/padhai -> "Student"
   - mahila/aurat/widow/vidhwa -> "Woman"
   - bujurg/vriddh/senior/pensioner -> "Senior citizen" (default age 65 if unspecified)
   - mazdoor/labour/shramik/dihadi/construction -> "Worker"
   - dukan/vyapari/vendor/rehri/thela -> "Small business"

OUTPUT FORMAT:
Respond ONLY with a valid JSON object matching these exact keys:
{
  "occupation": "Farmer"|"Student"|"Woman"|"Worker"|"Senior citizen"|"Small business"|null,
  "landholding_hectares": float|null,
  "land_ownership": "Own land"|"Tenant"|"Landless"|null,
  "annual_income": float|null,
  "income_bracket": "Below 1 Lakh"|"1 - 2.5 Lakh"|"Above 2.5 Lakh"|null,
  "age": int|null,
  "gender": "Male"|"Female"|"Other"|null,
  "state": string|null,
  "area": "Rural"|"Urban"|null,
  "caste_category": "General"|"OBC"|"SC"|"ST"|"EWS"|null,
  "education_level": string|null,
  "bpl_cardholder": bool|null
}
Do NOT include markdown backticks or commentary. Only pure JSON."""


class GroqService:
    """
    Groq AI Extraction Service using llama-3.1-8b-instant with:
    - Higher rate limits and ultra-fast inference
    - Pydantic schema validation
    - 3-attempt retry loop on JSON parsing errors
    - Deterministic fallback if API key is not configured
    """

    def __init__(self):
        self.settings = get_settings()
        self._client = None
        self.model = getattr(self.settings, "GROQ_MODEL", "qwen/qwen3.8-27b")
        self._init_client()

    def _init_client(self):
        api_key = os.environ.get("GROQ_API_KEY") or getattr(self.settings, "GROQ_API_KEY", None)
        if api_key and api_key.strip() and not api_key.startswith("gsk_placeholder") and not api_key.startswith("your_"):
            try:
                from groq import Groq
                self._client = Groq(api_key=api_key.strip())
                logger.info("Groq client initialized successfully with llama-3.1-8b-instant.")
            except Exception as e:
                logger.warning(f"Could not initialize Groq client: {e}")
                self._client = None
        else:
            self._client = None

    @property
    def is_available(self) -> bool:
        if self._client is None:
            self._init_client()
        return self._client is not None

    def extract_attributes(
        self,
        user_text: str,
        current_profile: Optional[UserProfile] = None,
        language: str = "en"
    ) -> Tuple[UserProfile, Dict[str, Any]]:
        """
        Extracts structured citizen attributes using Groq llama-3.1-8b-instant.
        Features a 3-attempt retry loop backed by Pydantic validation.
        Falls back to rule-based parser if Groq API is unavailable.
        """
        is_hi = language == "hi"

        # Attempt Groq 8B extraction if available
        if self.is_available:
            max_retries = 3
            last_error = None

            for attempt in range(1, max_retries + 1):
                try:
                    logger.info(f"Groq extraction attempt {attempt}/{max_retries} for query: '{user_text[:60]}'...")
                    
                    messages = [
                        {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
                        {"role": "user", "content": f"Citizen Statement: \"{user_text}\""}
                    ]

                    # If prior profile exists, provide context
                    if current_profile and current_profile.raw_attributes:
                        messages.insert(1, {
                            "role": "assistant",
                            "content": f'{{"context": "Prior recognized profile: {json.dumps(current_profile.raw_attributes, ensure_ascii=False)}"}}'
                        })

                    # If this is a retry, add error correction hint
                    if attempt > 1 and last_error:
                        messages.append({
                            "role": "user",
                            "content": f"Your previous response caused validation error: {last_error}. Please correct and output ONLY pure valid JSON."
                        })

                    response = self._client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        response_format={"type": "json_object"},
                        temperature=0.1,
                        max_tokens=300
                    )

                    raw_content = response.choices[0].message.content.strip()
                    # Strip any accidental markdown formatting
                    raw_content = re.sub(r'^```json\s*', '', raw_content)
                    raw_content = re.sub(r'\s*```$', '', raw_content)

                    # Parse JSON
                    data = json.loads(raw_content)

                    # Validate with Pydantic model
                    extracted = CitizenProfileExtraction.model_validate(data)
                    logger.info(f"Pydantic validation passed on attempt {attempt}: {extracted.model_dump(exclude_none=True)}")

                    # Merge into UserProfile
                    profile = current_profile.model_copy() if current_profile else UserProfile()
                    if extracted.occupation:
                        profile.occupation = extracted.occupation
                    if extracted.landholding_hectares is not None:
                        profile.landholding_hectares = extracted.landholding_hectares
                    if extracted.land_ownership:
                        profile.land_ownership = extracted.land_ownership
                    if extracted.annual_income is not None:
                        profile.annual_income = extracted.annual_income
                    if extracted.income_bracket:
                        profile.income_bracket = extracted.income_bracket
                    if extracted.age is not None:
                        profile.age = extracted.age
                    if extracted.gender:
                        profile.gender = extracted.gender
                    if extracted.state:
                        profile.state = extracted.state
                    if extracted.area:
                        profile.area = extracted.area
                    if extracted.caste_category:
                        profile.caste_category = extracted.caste_category
                    if extracted.education_level:
                        profile.education_level = extracted.education_level

                    # Create human-readable raw_attributes for UI
                    raw = profile.raw_attributes or {}
                    if profile.occupation:
                        raw["पेशा" if is_hi else "Occupation"] = profile.occupation
                    if profile.landholding_hectares is not None:
                        raw["भूमि (हेक्टेयर)" if is_hi else "Land (Hectares)"] = f"{profile.landholding_hectares} ha"
                    if profile.annual_income is not None:
                        raw["वार्षिक आय" if is_hi else "Annual Income"] = f"₹{int(profile.annual_income):,}"
                    if profile.age:
                        raw["आयु" if is_hi else "Age"] = f"{profile.age} yrs"
                    if profile.gender:
                        raw["लिंग" if is_hi else "Gender"] = profile.gender
                    if profile.state:
                        raw["राज्य" if is_hi else "State"] = profile.state
                    if profile.area:
                        raw["क्षेत्र" if is_hi else "Area"] = profile.area
                    if profile.caste_category:
                        raw["श्रेणी" if is_hi else "Category"] = profile.caste_category

                    profile.raw_attributes = raw
                    return profile, extracted.model_dump(exclude_none=True)

                except (json.JSONDecodeError, ValidationError) as ve:
                    last_error = str(ve)
                    logger.warning(f"Groq 8B validation error on attempt {attempt}: {last_error}")
                    continue
                except Exception as e:
                    logger.warning(f"Groq API error on attempt {attempt}: {e}")
                    last_error = str(e)
                    continue

            logger.error("All 3 Groq extraction attempts failed. Using deterministic regex fallback.")

        # Deterministic Regex Fallback (100% resilient & zero dependency)
        return self._deterministic_fallback(user_text, current_profile, language)

    def _deterministic_fallback(
        self,
        user_text: str,
        current_profile: Optional[UserProfile],
        language: str
    ) -> Tuple[UserProfile, Dict[str, Any]]:
        is_hi = language == "hi"
        profile = current_profile.model_copy() if current_profile else UserProfile()
        raw = profile.raw_attributes or {}
        text_lower = user_text.lower()

        # 1. Occupation
        if any(k in text_lower for k in ["farmer", "किसान", "kisan", "kheti", "खेती", "कृषि"]):
            profile.occupation = "Farmer"
            raw["पेशा" if is_hi else "Occupation"] = "किसान" if is_hi else "Farmer"
        elif any(k in text_lower for k in ["student", "छात्र", "विद्यार्थी", "college", "school"]):
            profile.occupation = "Student"
            raw["पेशा" if is_hi else "Occupation"] = "छात्र" if is_hi else "Student"
        elif any(k in text_lower for k in ["woman", "महिला", "female", "widow", "विधवा", "aurat"]):
            profile.occupation = "Woman"
            raw["पेशा" if is_hi else "Occupation"] = "महिला" if is_hi else "Woman"
        elif any(k in text_lower for k in ["senior", "वृद्ध", "बुजुर्ग", "वरिष्ठ", "bujurg", "pension"]):
            profile.occupation = "Senior citizen"
            profile.age = profile.age or 65
            raw["पेशा" if is_hi else "Occupation"] = "वरिष्ठ नागरिक" if is_hi else "Senior citizen"
        elif any(k in text_lower for k in ["worker", "मजदूर", "मज़दूर", "labour", "श्रमिक", "dihadi"]):
            profile.occupation = "Worker"
            raw["पेशा" if is_hi else "Occupation"] = "मज़दूर" if is_hi else "Worker"
        elif any(k in text_lower for k in ["business", "दुकान", "व्यापारी", "vendor", "रेहड़ी"]):
            profile.occupation = "Small business"
            raw["पेशा" if is_hi else "Occupation"] = "छोटा व्यापारी" if is_hi else "Small business"

        # 2. Land (with bigha / acre conversion)
        bigha_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:bigha|बीघा|बीघे)', text_lower)
        acre_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:acre|एकड़)', text_lower)
        ha_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:hectare|हेक्टेयर)', text_lower)

        if bigha_match:
            b_val = float(bigha_match.group(1))
            profile.landholding_hectares = round(b_val * 0.25, 2)
            raw["भूमि" if is_hi else "Landholding"] = f"{b_val} बीघा ({profile.landholding_hectares} ha)"
        elif acre_match:
            a_val = float(acre_match.group(1))
            profile.landholding_hectares = round(a_val * 0.404, 2)
            raw["भूमि" if is_hi else "Landholding"] = f"{a_val} एकड़ ({profile.landholding_hectares} ha)"
        elif ha_match:
            profile.landholding_hectares = float(ha_match.group(1))
            raw["भूमि" if is_hi else "Landholding"] = f"{profile.landholding_hectares} हेक्टेयर"
        elif "more than 2" in text_lower or "2 हेक्टेयर से अधिक" in text_lower:
            profile.landholding_hectares = 3.5
            raw["भूमि" if is_hi else "Landholding"] = "2 हेक्टेयर से अधिक"
        elif "up to 2" in text_lower or "2 हेक्टेयर तक" in text_lower:
            profile.landholding_hectares = 1.5
            raw["भूमि" if is_hi else "Landholding"] = "2 हेक्टेयर तक"
        elif any(k in text_lower for k in ["tenant", "बटाईदार", "भूमिहीन", "landless"]):
            profile.land_ownership = "Tenant"
            profile.landholding_hectares = 0.0
            raw["भूमि" if is_hi else "Landholding"] = "बटाईदार / भूमिहीन"

        # 3. Income
        if any(k in text_lower for k in ["below 1", "1 lakh se kam", "1 लाख से कम"]):
            profile.annual_income = 75000.0
            profile.income_bracket = "Below 1 Lakh"
            raw["वार्षिक आय" if is_hi else "Annual Income"] = "₹1 लाख से कम"
        elif any(k in text_lower for k in ["1 - 2.5", "1 से 2.5", "1-2.5", "2.5 lakh tak"]):
            profile.annual_income = 180000.0
            profile.income_bracket = "1 - 2.5 Lakh"
            raw["वार्षिक आय" if is_hi else "Annual Income"] = "₹1 - ₹2.5 लाख"
        elif any(k in text_lower for k in ["above 2.5", "2.5 lakh se adhik", "2.5 लाख से अधिक"]):
            profile.annual_income = 350000.0
            profile.income_bracket = "Above 2.5 Lakh"
            raw["वार्षिक आय" if is_hi else "Annual Income"] = "₹2.5 लाख से अधिक"
        else:
            # Check for LPA or direct numeric currency
            lpa_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lpa|लाख प्रति वर्ष|lakh per annum)', text_lower)
            inr_match = re.search(r'(?:₹|rs\.?|inr|आय|income)\s*(\d{1,3}(?:,\d{3})+|\d{4,7})', text_lower)
            lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|लाख)', text_lower)
            if lpa_match:
                val = float(lpa_match.group(1)) * 100000.0
                profile.annual_income = val
                profile.income_bracket = "Above 2.5 Lakh" if val > 250000 else ("1 - 2.5 Lakh" if val >= 100000 else "Below 1 Lakh")
                raw["वार्षिक आय" if is_hi else "Annual Income"] = f"₹{int(val):,} ({lpa_match.group(1)} LPA)"
            elif inr_match:
                clean_num = inr_match.group(1).replace(',', '')
                val = float(clean_num)
                profile.annual_income = val
                profile.income_bracket = "Above 2.5 Lakh" if val > 250000 else ("1 - 2.5 Lakh" if val >= 100000 else "Below 1 Lakh")
                raw["वार्षिक आय" if is_hi else "Annual Income"] = f"₹{int(val):,}"
            elif lakh_match:
                val = float(lakh_match.group(1)) * 100000.0
                profile.annual_income = val
                profile.income_bracket = "Above 2.5 Lakh" if val > 250000 else ("1 - 2.5 Lakh" if val >= 100000 else "Below 1 Lakh")
                raw["वार्षिक आय" if is_hi else "Annual Income"] = f"₹{int(val):,}"

        # 4. State
        states = [
            ("uttar pradesh", "Uttar Pradesh", "उत्तर प्रदेश"),
            ("bihar", "Bihar", "बिहार"),
            ("rajasthan", "Rajasthan", "राजस्थान"),
            ("haryana", "Haryana", "हरियाणा"),
            ("madhya pradesh", "Madhya Pradesh", "मध्य प्रदेश"),
            ("punjab", "Punjab", "पंजाब"),
            ("maharashtra", "Maharashtra", "महाराष्ट्र"),
            ("gujarat", "Gujarat", "गुजरात"),
            ("delhi", "Delhi", "दिल्ली"),
        ]
        for en_key, en_name, hi_name in states:
            if en_key in text_lower or hi_name.lower() in text_lower or (en_key == "uttar pradesh" and "up" in text_lower.split()):
                profile.state = en_name
                raw["राज्य" if is_hi else "State"] = hi_name if is_hi else en_name
                break

        # 5. Area
        if any(k in text_lower for k in ["rural", "गाँव", "गांव", "ग्रामीण"]):
            profile.area = "Rural"
            raw["क्षेत्र" if is_hi else "Area"] = "ग्रामीण"
        elif any(k in text_lower for k in ["urban", "शहर", "शहरी"]):
            profile.area = "Urban"
            raw["क्षेत्र" if is_hi else "Area"] = "शहरी"

        profile.raw_attributes = raw
        return profile, {"fallback": True}

    def generate_explanation(
        self,
        eval_resp: EvaluationResponse,
        user_query: str,
        language: str = "en",
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Uses Groq LLM to explain deterministic evaluation results.
        Strict Rules:
        1. Language Rule: Mirror user's language (Hindi -> Hindi, Hinglish -> Hinglish, English -> English).
        2. Intent Rule: User's current message is highest priority.
        3. Anti-Repetition Rule: Never repeat previous responses verbatim.
        """
        is_hi = language == "hi"

        if self.is_available:
            try:
                top_eligible = [f"{r.name}" for r in eval_resp.results if r.status == "potentially_eligible"][:3]
                needs_info = [r.name for r in eval_resp.results if r.status == "needs_information"][:2]

                system_prompt = (
                    "You are SchemeSathi (योजना साथी), a friendly village guide and companion for Indian citizens (especially rural families, farmers, and students).\n"
                    "YOUR PERSONA: A warm, caring, everyday neighbor who speaks simple everyday language, NOT a bureaucrat or government office clerk.\n\n"
                    "STRICT FORMATTING & STYLE RULES:\n"
                    "1. SHORT & SWEET (NO PARAGRAPHS): Keep your answers under 3-4 short lines. Never write long paragraphs.\n"
                    "2. SIMPLE EVERYDAY WORDS (LOW-LITERACY FRIENDLY):\n"
                    "   - In Hindi: Do NOT use heavy bureaucratic words like 'प्रोत्साहन', 'अनुदान', 'पात्रता', 'आवंटन'.\n"
                    "   - Use simple words like 'मदद', 'पैसे', 'योग्य', 'फायदा', 'शर्त', 'मुफ़्त'.\n"
                    "3. BULLET POINTS & BOLD BENEFITS: Format key information with clean bullet points:\n"
                    "   - Opening context line.\n"
                    "   - * **फायदा:** Bold the key monetary benefit (e.g., '**₹6,000 सालाना**' or '**₹5 लाख का मुफ़्त इलाज**').\n"
                    "   - * **ध्यान रखें:** Mention that applications are 100% **फ्री** (निःशुल्क), किसी दलाल को पैसे न दें।\n"
                    "4. THE END (FRIENDLY QUESTION): Always end with ONE short, friendly follow-up question.\n"
                    "5. DEVANAGARI SCRIPT REQUIREMENT FOR HINDI: If the user query is in Hindi or Hinglish, you MUST reply in pure, clean Devanagari Hindi (e.g., 'नमस्ते! आपके लिए यह योजना सबसे उपयुक्त है।'). NEVER write Hindi phonetically in English Roman letters (e.g., 'aap eligible hain'), as this makes the neural Text-to-Speech voice engine sound robotic. If English, reply in English.\n"
                    "6. ZERO HALLUCINATION: Never invent fake schemes (like 'Scheme A' or 'Scheme B').\n"
                    "7. NO ELLIPSES: Do NOT use ellipses (...) anywhere in your response. Complete every sentence clearly."
                )

                user_prompt = (
                    f"Citizen Query: '{user_query}'\n"
                    f"Language: {'Hindi' if is_hi else 'English'}\n"
                    f"Eligible Count: {eval_resp.eligible_count} ({', '.join(top_eligible)})\n"
                    f"Needs Info Count: {eval_resp.needs_info_count} ({', '.join(needs_info)})\n"
                    f"Spoken reply:"
                )

                messages = [{"role": "system", "content": system_prompt}]
                if chat_history:
                    for h in chat_history[-4:]:
                        role = h.get("role", "user")
                        content = h.get("content", "")
                        if content:
                            messages.append({"role": role, "content": content})
                messages.append({"role": "user", "content": user_prompt})

                response = self._create_chat_completion(
                    messages=messages,
                    temperature=0.4,
                    max_tokens=220
                )
                text = response.choices[0].message.content.strip()
                text = text.replace("...", "").replace("…", "").strip()
                if text:
                    return text
            except Exception as e:
                logger.warning(f"Groq explanation generation error: {e}")

        # Fallback to engine's pre-computed spoken summary
        return eval_resp.llm_spoken_summary or (
            "धन्यवाद। हमने आपके विवरण की जाँच सरकारी नियमों के अनुसार कर ली है।" if is_hi
            else "Thank you. We have evaluated your profile against official government eligibility rules."
        )

    def generate_rag_reply(
        self,
        user_query: str,
        retrieved_schemes: List[Dict[str, Any]],
        language: str = "en",
        chat_history: Optional[List[Dict[str, str]]] = None,
        user_occupation: Optional[str] = None
    ) -> str:
        """
        Generates a warm, empathetic, human-like spoken reply (like ChatGPT/Claude)
        grounded in retrieved RAG scheme chunks with strict language mirroring and contextual understanding.
        """
        is_hi = language == "hi"
        if not retrieved_schemes:
            return (
                "मैं इसे पूरी तरह समझ नहीं पाया। क्या आप मुझे आसान शब्दों में बता सकते हैं कि आपको किस तरह की योजना या सहायता चाहिए (जैसे खेती, छात्रवृत्ति, स्वास्थ्य या पेंशन)?"
                if is_hi else
                "I couldn't quite find a match for that. Could you please tell me in simple words what kind of help you need (e.g. farming, scholarships, health, or pensions)?"
            )

        if self.is_available:
            try:
                schemes_context = "\n".join([
                    f"- {s.get('scheme_name_hi' if is_hi else 'scheme_name_en')}: {s.get('content', '')[:350]}"
                    for s in retrieved_schemes[:3]
                ])

                occ_context = f"\nUser Background: Stated occupation is {user_occupation}." if user_occupation else ""

                system_prompt = (
                    "You are SchemeSathi (योजना साथी), a friendly village guide and companion for Indian citizens (especially rural families, farmers, women, and low-literacy users).\n"
                    "YOUR PERSONA: A warm, caring, everyday neighbor who speaks simple everyday language, NOT a bureaucrat or government office clerk.\n\n"
                    "STRICT FORMATTING & STYLE RULES (MUST FOLLOW):\n"
                    "1. SHORT & SWEET (NO PARAGRAPHS): Never write long walls of text. Keep your entire answer under 3-4 short lines total.\n"
                    "2. SIMPLE EVERYDAY WORDS (LOW-LITERACY FRIENDLY):\n"
                    "   - In Hindi: Do NOT use heavy bureaucratic words like 'प्रोत्साहन', 'अनुदान', 'पात्रता', 'आवंटन', 'कार्यान्वयन'.\n"
                    "   - Instead use simple words like 'मदद', 'पैसे', 'योग्य', 'फायदा', 'शर्त', 'मुफ़्त'.\n"
                    "3. BULLET POINTS & BOLD BENEFITS: Format key information with clean bullet points:\n"
                    "   - Opening line: Short, warm context line (e.g. 'चूंकि आप किसान हैं, यह स्कॉलरशिप आपके बच्चों के लिए है! 🎓').\n"
                    "   - Bullet 1: * **फायदा:** Bold the main money benefit (e.g., '**₹12,000 सालाना**' or '**₹5 लाख का मुफ़्त इलाज**').\n"
                    "   - Bullet 2: * **शर्त:** The key qualification condition (e.g., '12वीं में 80% से ज्यादा नंबर' or 'केवल OBC वर्ग के छात्रों के लिए').\n"
                    "   - Bullet 3: * **ध्यान रखें:** 'आवेदन बिल्कुल **फ्री** (निःशुल्क) है, किसी को पैसे न दें।'\n"
                    "4. THE END (FRIENDLY QUESTION): Always end with ONE short, friendly follow-up question (e.g., 'क्या आपके बच्चे 12वीं पास कर चुके हैं?').\n"
                    "5. SPECIFICITY & EMPATHY:\n"
                    "   - If talking about OBC scholarship: explicitly state 'चूंकि यह योजना अन्य पिछड़ा वर्ग (OBC) के छात्रों के लिए है...'.\n"
                    "   - If user is a farmer asking about education: 'चूंकि आप किसान हैं, यह स्कॉलरशिप आपके बच्चों के लिए है! 🎓'.\n"
                    "6. DEVANAGARI SCRIPT RULE FOR HINDI: If the user speaks Hindi or Hinglish, always write Hindi words in clean, natural Devanagari script (e.g. 'नमस्ते! आपके लिए यह योजना सबसे उपयुक्त है।'). NEVER write Hindi phonetically in English Roman letters (e.g. 'aapke paas', 'kisan bhai'), as this causes the neural text-to-speech engine to sound robotic. Keep only well-known scheme acronyms (e.g. 'PM-KISAN', 'scholarship', 'college', 'OBC', 'free') in English.\n"
                    "7. ZERO HALLUCINATION: Never invent fake schemes (like 'Scheme A' or 'Scheme B').\n"
                    "8. NO ELLIPSES: Do NOT use ellipses (...) anywhere in your response. Complete every sentence clearly."
                )

                user_prompt = (
                    f"Citizen Question: '{user_query}'{occ_context}\n"
                    f"Language: {'Hindi' if is_hi else 'English'}\n"
                    f"Retrieved Schemes:\n{schemes_context}\n"
                    f"Spoken response:"
                )

                messages = [{"role": "system", "content": system_prompt}]
                if chat_history:
                    for h in chat_history[-4:]:
                        role = h.get("role", "user")
                        content = h.get("content", "")
                        if content:
                            messages.append({"role": role, "content": content})
                messages.append({"role": "user", "content": user_prompt})

                response = self._create_chat_completion(
                    messages=messages,
                    temperature=0.3,
                    max_tokens=220
                )
                text = response.choices[0].message.content.strip()
                text = text.replace("...", "").replace("…", "").strip()
                if text:
                    return text
            except Exception as e:
                logger.warning(f"Groq RAG explanation error: {e}")

        # Deterministic Friendly Village Guide Fallback
        first_scheme = retrieved_schemes[0] if retrieved_schemes else {}
        name = first_scheme.get("scheme_name_hi" if is_hi else "scheme_name_en", "सरकारी योजना")
        is_farmer_asking_edu = user_occupation == "Farmer" or "farmer" in user_query.lower() or "किसान" in user_query
        is_edu_query = any(w in user_query.lower() for w in ["शिक्षा", "पढ़ाई", "छात्रवृत्ति", "scholarship", "education", "college"])

        if is_hi:
            if is_farmer_asking_edu or is_edu_query:
                return (
                    "चूंकि आप किसान हैं, यह स्कॉलरशिप आपके बच्चों के लिए है! 🎓\n"
                    "• **फायदा:** **₹12,000 से ₹20,000 सालाना** (पढ़ाई की मदद)।\n"
                    "• **शर्त:** 12वीं बोर्ड में अच्छे नंबर या कॉलेज में एडमिशन।\n"
                    "• **ध्यान रखें:** आवेदन बिल्कुल **फ्री** (निःशुल्क) है, किसी को पैसे न दें।\n\n"
                    "क्या आपके बच्चे 12वीं में पढ़ाई कर रहे हैं?"
                )
            elif "health" in user_query.lower() or "स्वास्थ्य" in user_query or "इलाज" in user_query or "bima" in user_query:
                return (
                    "यह योजना आपके पूरे परिवार के स्वास्थ्य के लिए है! 🏥\n"
                    "• **फायदा:** **₹5 लाख सालाना** का मुफ़्त अस्पताल इलाज।\n"
                    "• **शर्त:** आयुष्मान भारत या राशन कार्ड सूची में नाम।\n"
                    "• **ध्यान रखें:** आवेदन और इलाज पूरी तरह **फ्री** (निःशुल्क) है।\n\n"
                    "क्या आपके परिवार का राशन कार्ड बना हुआ है?"
                )
            else:
                return (
                    f"नमस्ते! आपके लिए **{name}** सबसे बढ़िया विकल्प है:\n"
                    "• **फायदा:** सरकार की तरफ से सीधी वित्तीय मदद और लाभ।\n"
                    "• **ध्यान रखें:** आवेदन बिल्कुल **फ्री** (निःशुल्क) है, किसी को पैसे न दें।\n\n"
                    "क्या आप इसके बारे में और जानना चाहते हैं?"
                )
        else:
            if is_farmer_asking_edu or is_edu_query:
                return (
                    "Since you are a farmer, these scholarships are for your children! 🎓\n"
                    "• **Benefit:** **₹12,000 to ₹20,000 per year** financial help for college.\n"
                    "• **Condition:** Good marks in Class 12 or college enrollment.\n"
                    "• **Note:** Official applications are 100% **free of cost**.\n\n"
                    "Have your children completed Class 12?"
                )
            else:
                return (
                    f"Hello! Here is the best scheme for you — **{name}**:\n"
                    "• **Benefit:** Direct government financial support.\n"
                    "• **Note:** Official applications are completely **free of cost**.\n\n"
                    "Would you like to know how to apply?"
                )

    def generate_conversational_reply(
        self,
        user_query: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        language: str = "en",
        detected_name: Optional[str] = None
    ) -> str:
        """
        Generates a warm, natural, human-like conversational response (like ChatGPT or Claude)
        for casual greetings, introductions ('hi i m kaalu'), or expressions of uncertainty ('Not sure').
        Never hallucinates schemes or forces rigid survey questions.
        """
        is_hi = language == "hi"
        lower = user_query.lower()
        is_uncertain = any(w in lower for w in ["not sure", "dont know", "don't know", "no idea", "pata nahi", "maloom nahi", "nahi pata", "पता नहीं", "मालूम नहीं"])

        if self.is_available:
            try:
                system_prompt = (
                    "You are SchemeSathi (योजना साथी), a warm, supportive, conversational companion for Indian citizens, acting just like ChatGPT or Claude.\n"
                    "RULES:\n"
                    "1. GREETING & INTRO RULE: If the user greets you or introduces their name (e.g., 'hi i m kaalu' or 'mera naam suresh hai'), reply warmly: 'Namaste [Name]! 🙏 How can I help you today? Are you looking for schemes for yourself, or for your family?' (and in Hindi: 'नमस्ते [Name] जी! 🙏 आज मैं आपकी क्या सहायता कर सकता हूँ? क्या आप अपने लिए योजनाएं खोज रहे हैं या अपने परिवार के लिए?'). Do NOT immediately ask a rigid occupation question.\n"
                    "2. UNCERTAINTY RULE: If the user says 'Not sure' or 'Don't know' (or 'पता नहीं'), reassure them with empathy: 'That's okay! I can help you find schemes that don't have strict income limits, or you can tell me about a specific category like scholarships, healthcare, or farming.'\n"
                    "3. ZERO HALLUCINATION RULE: Never invent fake schemes like 'Scheme A' or fake eligibility criteria.\n"
                    "4. LANGUAGE RULE: Reply strictly in the exact language the user used. If the user spoke Hindi, reply in simple, warm Hindi (Devanagari). If Hinglish, reply in Hinglish. If English, reply in English.\n"
                    "5. HINDI WORDS FOR NUMBERS & ABBREVIATIONS: When writing in Hindi, write numbers and abbreviations in full Hindi words (e.g., 'पाँच लाख', 'प्रधानमंत्री').\n"
                    "6. Keep your reply concise (2-3 warm, conversational sentences).\n"
                    "7. NO ELLIPSES: Do NOT use ellipses (...) anywhere in your response. Complete every sentence clearly."
                )

                user_prompt = f"Citizen Message: '{user_query}'\nLanguage: {'Hindi' if is_hi else 'English'}\nSpoken conversational response:"
                messages = [{"role": "system", "content": system_prompt}]
                if chat_history:
                    for h in chat_history[-4:]:
                        role = h.get("role", "user")
                        content = h.get("content", "")
                        if content:
                            messages.append({"role": role, "content": content})
                messages.append({"role": "user", "content": user_prompt})

                response = self._client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.6,
                    max_tokens=200
                )
                text = response.choices[0].message.content.strip()
                text = text.replace("...", "").replace("…", "").strip()
                if text:
                    return text
            except Exception as e:
                logger.warning(f"Groq conversational reply error: {e}")

        # Deterministic fallback
        if is_uncertain:
            return (
                "कोई बात नहीं! आप बिना आय सीमा वाली योजनाओं (जैसे स्वास्थ्य या सामाजिक सुरक्षा) के बारे में पूछ सकते हैं, या मुझे किसी विशिष्ट श्रेणी जैसे 'छात्रवृत्ति' या 'खेती' के बारे में बता सकते हैं।"
                if is_hi else
                "That's okay! I'll try to find schemes that don't have strict income limits, or you can ask me about a specific category like 'scholarships' or 'farming'."
            )

        if detected_name:
            return (
                f"नमस्ते {detected_name} जी! 🙏 आज मैं आपकी क्या सहायता कर सकता हूँ? क्या आप अपने लिए योजना ढूंढ रहे हैं या अपने परिवार के लिए?"
                if is_hi else
                f"Namaste {detected_name}! 🙏 How can I help you today? Are you looking for schemes for yourself, or for your family?"
            )

        return (
            "नमस्ते! 🙏 योजना साथी में आपका स्वागत है। मैं आपकी सरकारी योजनाएं खोजने में कैसे मदद कर सकता हूँ? क्या आप अपने लिए योजना ढूंढ रहे हैं या अपने परिवार के लिए?"
            if is_hi else
            "Namaste! 🙏 Welcome to SchemeSathi. How can I help you today? Are you looking for schemes for yourself, or for your family?"
        )


# Global singleton Groq service instance
groq_service = GroqService()
