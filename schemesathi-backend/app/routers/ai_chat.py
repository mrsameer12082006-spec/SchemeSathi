import base64
import logging
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app.models.profile import UserProfile
from app.models.scheme import EvaluationResponse
from app.services.session_store import session_store
from app.services.supabase_service import supabase_service
from app.services.eligibility_engine import eligibility_engine
from app.services.groq_service import groq_service
from app.services.voice_service import voice_service
from app.services.rag_service import rag_service

logger = logging.getLogger("schemesathi.aichat")
router = APIRouter(prefix="/api/ai", tags=["AI Voice & Natural Language Engine"])


class ExtractRequest(BaseModel):
    text: str = Field(..., description="Spoken or typed citizen query in Hindi, Hinglish, or English")
    language: str = Field("en", description="'en' or 'hi'")


class SearchRequest(BaseModel):
    query: str = Field(..., description="Semantic search query in Hindi or English")
    top_k: int = Field(3, description="Number of scheme chunks to retrieve")


class SynthesizeRequest(BaseModel):
    text: str = Field(..., description="Text to speak out loud")
    language: str = Field("hi", description="'hi' or 'en'")
    speaker: Optional[str] = Field(None, description="Optional Sarvam speaker persona override (defaults to natural companion)")


class AIChatTurnRequest(BaseModel):
    session_id: Optional[str] = Field(None, description="Optional active session ID (creates one if omitted)")
    message: Optional[str] = Field(None, description="Typed user message")
    audio_base64: Optional[str] = Field(None, description="Base64 encoded audio from microphone")
    audio_filename: Optional[str] = Field("user_speech.wav", description="Audio filename")
    language: str = Field("en", description="'en' or 'hi'")
    synthesize_audio: bool = Field(False, description="Whether to generate TTS audio in response")


class AIChatTurnResponse(BaseModel):
    session_id: str
    transcript: str
    reply: str
    audio_base64: Optional[str] = None
    fallback_to_browser_tts: bool = False
    profile: Dict[str, Any]
    recognized_attributes: Dict[str, Any]
    eligible_count: int
    needs_info_count: int
    not_eligible_count: int
    results: List[Dict[str, Any]]
    done: bool
    show_results: bool = False
    results_url: str = "/results"


def detect_user_language(text: str, default_lang: str = "en") -> str:
    """
    Detects if the user is speaking Hindi (Devanagari), Hinglish, or English.
    Returns 'hi' or 'en'.
    """
    if not text:
        return default_lang
    import re
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"
    lower = text.lower()
    hinglish_markers = {
        "kisan", "kisaan", "kheti", "zamin", "zameen", "fasal", "padhai",
        "chhatravritti", "yojana", "yojanaye", "batao", "bataiye", "mujhe",
        "mera", "meri", "mere", "hai", "hain", "kya", "kaise", "milega",
        "chahiye", "sarkar", "sarkari", "shiksha", "paisa", "rupaye", "dihadi",
        "mazdoor", "mahila", "vidhwa", "bujurg", "beti", "namaste", "pranam", "hoon"
    }
    tokens = set(re.findall(r'\b[a-zA-Z]+\b', lower))
    if tokens & hinglish_markers:
        return "hi"
    return default_lang


def extract_query_intent(user_text: str) -> Optional[str]:
    """
    Extracts explicit subject/domain intent from the user query.
    Takes precedence over static profile occupation (e.g., a farmer asking for education).
    """
    lower = user_text.lower()
    if any(k in lower for k in ["education", "scholarship", "study", "college", "school", "student", "शिक्षा", "पढ़ाई", "छात्रवृत्ति", "विद्यार्थी", "स्कॉलरशिप", "दाखिला"]):
        return "education scholarship student college school schemes"
    if any(k in lower for k in ["maternity", "pregnant", "girl child", "daughter", "mother", "विधवा", "महिला", "मातृत्व", "गर्भवती", "बेटी", "सुकन्या", "लाडली"]):
        return "women maternity girl child pregnant mother welfare schemes"
    if any(k in lower for k in ["health", "medical", "hospital", "treatment", "insurance", "दवा", "इलाज", "अस्पताल", "स्वास्थ्य", "आयुष्मान", "बीमारी"]):
        return "health medical treatment hospital insurance schemes"
    if any(k in lower for k in ["housing", "house", "home", "awas", "मकान", "घर", "आवास", "छत"]):
        return "housing awas home shelter construction schemes"
    if any(k in lower for k in ["pension", "old age", "elderly", "पेंशन", "वृद्धावस्था", "बुजुर्ग", "वरिष्ठ नागरिक"]):
        return "senior citizen old age pension social security schemes"
    if any(k in lower for k in ["loan", "business", "shop", "vendor", "mudra", "start business", "ऋण", "लोन", "व्यापार", "दुकान", "मुद्रा", "उद्यम"]):
        return "small business loan micro enterprise vendor subsidy schemes"
    if any(k in lower for k in ["crop", "irrigation", "sinchayee", "fasal", "kheti", "खेती", "फसल", "बीज", "खाद", "सिंचाई"]):
        return "agriculture farmer crop insurance irrigation cultivation schemes"
    if any(k in lower for k in ["kitna paisa", "kitne paise", "kitna paise", "how much does it cost", "fees", "fee", "paisa lagta hai", "charges", "kitna kharcha"]):
        return "government scheme application fee cost free zero fee direct benefit"
    return None


def is_gibberish(text: str) -> bool:
    clean = text.strip().lower()
    if not clean:
        return True
    import re
    tokens = clean.split()
    if len(tokens) == 1 and len(clean) >= 5:
        if re.match(r'^[a-z]+$', clean):
            vowels = set("aeiou")
            if not any(c in vowels for c in clean):
                return True
            if re.search(r'[bcdfghjklmnpqrstvwxyz]{5,}', clean):
                return True
            keyboard_walks = ["asdf", "sdfg", "dfgh", "fghj", "ghjk", "hjkl", "qwerty", "zxcv"]
            if any(w in clean for w in keyboard_walks):
                return True
    return False


def load_schemes_catalog() -> Dict[str, Dict[str, Any]]:
    import json
    from pathlib import Path
    for p in [
        Path(__file__).resolve().parents[3] / "data" / "top_40_schemes.json",
        Path(__file__).resolve().parents[2] / "data" / "top_40_schemes.json",
        Path("data/top_40_schemes.json"),
    ]:
        if p.exists():
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return {s["code"]: s for s in data if "code" in s}
            except Exception:
                pass
    return {}

SCHEMES_CATALOG = load_schemes_catalog()


def format_rag_cards(
    rag_chunks: List[Dict[str, Any]],
    is_hi: bool,
    domain_intent: Optional[str],
    citizen_occupation: Optional[str],
    clean_text: str
) -> List[Dict[str, Any]]:
    seen_codes = set()
    deduped_results = []
    lower_text = clean_text.lower()
    is_farmer_asking_edu = (
        (citizen_occupation == "Farmer" or "farmer" in lower_text or "किसान" in clean_text)
        and domain_intent and domain_intent.startswith("education")
    )

    for c in rag_chunks:
        code = c.get("scheme_code", "")
        if not code or code in seen_codes:
            continue
        seen_codes.add(code)

        catalog_item = SCHEMES_CATALOG.get(code)
        if catalog_item:
            name = catalog_item.get("name_hi" if is_hi else "name_en") or c.get("scheme_name_hi" if is_hi else "scheme_name_en")
            summary = catalog_item.get("summary_hi" if is_hi else "summary_en") or ""
            benefits = catalog_item.get("benefits_hi" if is_hi else "benefits_en") or ""
            official_url = catalog_item.get("official_url", "")
            category = (catalog_item.get("category") or "General").capitalize()
        else:
            name = c.get("scheme_name_hi" if is_hi else "scheme_name_en") or c.get("chunk_title", "")
            summary = c.get("content", "")
            benefits = c.get("content", "")
            official_url = ""
            category = c.get("category", "General")

        # Guarantee summary never shows ugly raw data dump
        if summary.startswith("Eligibility Criteria for") or "Target Category/Occupation" in summary or summary.startswith("Scheme:"):
            if "scholarship" in code or "higher" in code or "obc" in code or "matric" in code or "csss" in code:
                summary = (
                    "उच्च शिक्षा और अध्ययन के लिए पात्र छात्रों को प्रति वर्ष ₹12,000 से ₹20,000 तक की छात्रवृत्ति सहायता।"
                    if is_hi else
                    "Financial scholarship support of ₹12,000 to ₹20,000 per year for students pursuing higher education."
                )
            elif "pmfby" in code:
                summary = (
                    "प्राकृतिक आपदाओं, सूखा, बाढ़ और बेमौसम बारिश से फसल नुकसान के विरुद्ध रियायती फसल बीमा।"
                    if is_hi else
                    "Comprehensive subsidized crop loss insurance against drought, floods, and unseasonal rains."
                )
            elif "kisan" in code:
                summary = (
                    "भूमिधारक किसान परिवारों को ₹6,000 प्रति वर्ष 3 समान किस्तों में प्रत्यक्ष आर्थिक सहायता।"
                    if is_hi else
                    "Direct income support of ₹6,000 per year in 3 equal installments to landholding farmer families."
                )

        # Build 100% Scheme-Specific "Why" items (eliminating duplicate card text)
        passed = []
        missing = []

        # 1. Main Benefit & Context in passed
        if benefits:
            passed.append(f"मुख्य फायदा: {benefits}" if is_hi else f"Key Benefit: {benefits}")
        elif summary:
            passed.append(summary)

        if is_farmer_asking_edu:
            passed.append(
                "आपके बच्चों या परिवार के छात्रों के लिए लागू"
                if is_hi else
                "Applies to students / children in your family"
            )
        elif domain_intent and domain_intent.startswith("health"):
            passed.append(
                "आपके पूरे परिवार के लिए ₹5 लाख तक का कैशलेस इलाज"
                if is_hi else
                "Up to ₹5 Lakh cashless hospital care for your entire family"
            )

        # 2. Scheme-Specific Criteria in missing (Each card gets its own unique requirements)
        if code == "post-matric-obc":
            missing = [
                "केवल अन्य पिछड़ा वर्ग (OBC) के छात्रों के लिए" if is_hi else "Strictly for Other Backward Class (OBC) students",
                "कक्षा 11वीं, 12वीं या कॉलेज/डिग्री कोर्स में अध्ययनरत" if is_hi else "Enrolled in class 11, 12, or college degree",
                "पारिवारिक वार्षिक आय ₹2.5 लाख से कम होनी चाहिए" if is_hi else "Family annual income must be below ₹2.5 Lakh"
            ]
        elif code == "csss-higher":
            missing = [
                "12वीं बोर्ड परीक्षा में शीर्ष 80 पर्सेंटाइल से अधिक अंक" if is_hi else "Class 12 board score above 80th percentile",
                "कॉलेज या विश्वविद्यालय में नियमित (Regular) एडमिशन" if is_hi else "Regular admission in college or university",
                "पारिवारिक वार्षिक आय ₹4.5 लाख से कम होनी चाहिए" if is_hi else "Family annual income must be below ₹4.5 Lakh"
            ]
        elif code == "pm-yasasvi":
            missing = [
                "ओबीसी (OBC), ईबीसी (EBC) या डीएनटी (DNT) वर्ग के छात्र" if is_hi else "For OBC, EBC, or DNT category students",
                "कक्षा 9वीं या 11वीं में पढ़ाई और छात्रवृत्ति परीक्षा" if is_hi else "Studying in Class 9 or 11 with scholarship exam",
                "पारिवारिक वार्षिक आय ₹2.5 लाख से कम" if is_hi else "Family annual income below ₹2.5 Lakh"
            ]
        elif code == "nmmss":
            missing = [
                "कक्षा 8वीं उत्तीर्ण छात्र (कक्षा 9 से 12 के अध्ययन हेतु)" if is_hi else "Class 8 pass students for classes 9 to 12",
                "सरकारी या सहायता प्राप्त स्कूल के नियमित छात्र" if is_hi else "Regular student in Govt / Aided school",
                "पारिवारिक वार्षिक आय ₹3.5 लाख से कम" if is_hi else "Family annual income below ₹3.5 Lakh"
            ]
        elif code == "pm-jay":
            missing = [
                "SECC 2011 या राशन कार्ड पात्रता सूची में नाम" if is_hi else "Family listed in SECC 2011 / ration card database",
                "अस्पताल में भर्ती होने पर ₹5 लाख तक का कैशलेस इलाज" if is_hi else "Cashless treatment up to ₹5 Lakh on hospitalization"
            ]
        elif code == "pmjay-senior":
            missing = [
                "70 वर्ष या उससे अधिक आयु के सभी वरिष्ठ नागरिक" if is_hi else "All senior citizens aged 70 years and above",
                "बिना किसी आय सीमा के ₹5 लाख का अलग स्वास्थ्य सुरक्षा कवर" if is_hi else "Dedicated ₹5 Lakh cover regardless of family income"
            ]
        elif code == "pm-kisan":
            missing = [
                "भू-अभिलेखों में किसान परिवार के नाम खेती योग्य भूमि" if is_hi else "Cultivable land ownership in land records",
                "प्रत्यक्ष लाभ अंतरण (DBT) हेतु बैंक खाता आधार से लिंक" if is_hi else "Bank account linked with Aadhaar for DBT"
            ]
        elif code == "pmfby":
            missing = [
                "अधिसूचित क्षेत्र में अधिसूचित फसल बोने वाले किसान (बटाईदार भी)" if is_hi else "Cultivating notified crops in notified areas (tenants included)",
                "प्राकृतिक आपदा या सूखे से फसल नुकसान का क्लेम" if is_hi else "Insurance claim on crop damage from natural disasters"
            ]
        else:
            # Dynamic extraction from scheme catalog eligibility
            elig = catalog_item.get("eligibility", {}) if catalog_item else {}
            castes = elig.get("caste_categories")
            if castes and set(castes) < {"General", "OBC", "SC", "ST", "EWS"}:
                missing.append(
                    f"वर्ग: केवल {', '.join(castes)} वर्ग के लिए" if is_hi else f"Category: Strictly for {', '.join(castes)}"
                )
            if elig.get("max_annual_income"):
                lakh = elig["max_annual_income"] / 100000.0
                missing.append(
                    f"पारिवारिक वार्षिक आय ₹{lakh:.1f} लाख से कम" if is_hi else f"Family annual income below ₹{lakh:.1f} Lakh"
                )
            if elig.get("allowed_occupations") and len(elig["allowed_occupations"]) <= 2:
                missing.append(
                    f"लक्षित पेशा: {', '.join(elig['allowed_occupations'])}" if is_hi else f"Target: {', '.join(elig['allowed_occupations'])}"
                )
            if not missing:
                missing.append(
                    "सटीक पात्रता पुष्टि के लिए अपनी श्रेणी, शिक्षा या आय का विवरण साझा करें"
                    if is_hi else
                    "To confirm exact eligibility, please share your category, education, or income details"
                )

        deduped_results.append({
            "scheme_id": code,
            "name": name,
            "summary": summary,
            "category": category,
            "status": "needs_information",
            "passed": passed,
            "failed": [],
            "missing": missing,
            "benefits": benefits,
            "official_url": official_url
        })
    return deduped_results


@router.post("/extract", summary="Extract structured citizen attributes using Groq 8B with Pydantic retry")
async def extract_profile_endpoint(req: ExtractRequest):
    """
    Direct entity extraction testing endpoint.
    Converts Hindi/Hinglish/English into structured UserProfile attributes
    with unit conversion (bigha -> hectares, monthly -> annual income).
    """
    profile, raw_extracted = groq_service.extract_attributes(req.text, language=req.language)
    return {
        "status": "success",
        "profile": profile.model_dump(exclude_none=True),
        "raw_attributes": profile.raw_attributes,
        "extracted_details": raw_extracted
    }


@router.post("/search", summary="Semantic RAG search over scheme knowledge base (Hindi/English)")
async def search_schemes_endpoint(req: SearchRequest):
    """
    RAG semantic search: queries Supabase pgvector RPC or local in-memory embeddings.
    Accepts natural Hindi or English questions (e.g. 'फसल बीमा के नियम', 'Aadhaar scholarship').
    """
    chunks = await rag_service.search(req.query, top_k=req.top_k)
    return {
        "status": "success",
        "query": req.query,
        "count": len(chunks),
        "results": chunks
    }


@router.post("/transcribe", summary="Transcribe speech audio via Sarvam AI Saaras STT")
async def transcribe_audio_endpoint(
    file: UploadFile = File(...),
    language: str = Form("hi-IN")
):
    """
    Transcribes audio bytes using Sarvam AI Saaras (best-in-class Hinglish accuracy).
    Falls back to mock service if SARVAM_API_KEY is not configured.
    """
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file received.")

    result = await voice_service.transcribe(audio_bytes, language_code=language, filename=file.filename or "audio.wav")
    return result


@router.post("/synthesize", summary="Synthesize Hindi/Indian English speech via Sarvam AI Bulbul TTS")
async def synthesize_speech_endpoint(req: SynthesizeRequest):
    """
    Synthesizes natural speech using Sarvam AI Bulbul v4-flash.
    Returns base64 encoded audio for immediate browser playback.
    """
    lang_code = "hi-IN" if req.language == "hi" else "en-IN"
    result = await voice_service.synthesize(req.text, language_code=lang_code, speaker=req.speaker)
    return result


@router.get("/synthesize/stream", summary="Real-time HTTP audio streaming via Sarvam Bulbul v4-flash")
async def stream_speech_get(
    text: str = Query(..., description="Text to speak"),
    lang: str = Query("hi", description="Language code ('hi' or 'en')"),
    speaker: Optional[str] = Query(None, description="Optional speaker ID override")
):
    """
    Streams audio/mpeg chunks with ultra-low latency (<400ms time to first word)
    using Sarvam Bulbul v4-flash streaming API.
    """
    lang_code = "hi-IN" if lang == "hi" else "en-IN"
    return StreamingResponse(
        voice_service.stream_synthesize(text, language_code=lang_code, speaker=speaker),
        media_type="audio/mpeg"
    )


@router.post("/synthesize/stream", summary="Real-time HTTP audio streaming via Sarvam Bulbul v4-flash (POST)")
async def stream_speech_post(req: SynthesizeRequest):
    """
    Streams audio/mpeg chunks with ultra-low latency (<400ms time to first word)
    using Sarvam Bulbul v4-flash streaming API.
    """
    lang_code = "hi-IN" if req.language == "hi" else "en-IN"
    return StreamingResponse(
        voice_service.stream_synthesize(req.text, language_code=lang_code, speaker=req.speaker),
        media_type="audio/mpeg"
    )


@router.post("/chat", response_model=AIChatTurnResponse, summary="Full AI Voice Agent Turn: STT -> Groq 8B Extraction -> Rule Engine -> Groq Explanation -> Sarvam TTS")
async def ai_chat_turn(req: AIChatTurnRequest):
    """
    Unified multimodal conversational pipeline:
    1. If audio provided, transcribes via Sarvam AI Saaras (STT).
    2. Extracts structured profile via Groq llama-3.1-8b-instant with Pydantic validation (unit conversion).
    3. Updates citizen profile in ephemeral RAM session (Zero-PII).
    4. Evaluates against Supabase scheme eligibility criteria via deterministic EligibilityEngine (Legal Truth).
    5. Explains results conversationally using Groq 8B.
    6. Generates high-fidelity Indian speech audio via Sarvam Bulbul (TTS).
    """
    # Step 1: Manage Ephemeral Session
    session_id = req.session_id
    record = session_store.get_session(session_id) if session_id else None
    if not record:
        session_res = session_store.create_session(language=req.language)
        session_id = session_res.session_id
        record = session_store.get_session(session_id)

    # Step 2: Handle Audio Transcription (STT) or Text
    user_text = (req.message or "").strip()
    stt_transcript = ""

    if req.audio_base64:
        try:
            audio_bytes = base64.b64decode(req.audio_base64)
            stt_lang = "hi-IN" if req.language == "hi" else "en-IN"
            stt_res = await voice_service.transcribe(
                audio_bytes,
                language_code=stt_lang,
                filename=req.audio_filename or "speech.wav"
            )
            stt_transcript = stt_res.get("transcript", "")
            if stt_transcript:
                user_text = stt_transcript
        except Exception as e:
            logger.error(f"Failed to decode or transcribe audio: {e}")

    clean_text = user_text.strip()
    active_lang = detect_user_language(clean_text, default_lang=req.language)
    is_hi = active_lang == "hi"

    # Step 3: Conversational Greeting, Name Introduction, or Uncertainty Handler
    # Prevents "dumb survey" state machine and eliminates hallucinated schemes
    import re
    lower_text = clean_text.lower()

    # Guard against gibberish inputs
    if is_gibberish(clean_text):
        gibberish_reply = (
            "मैं इसे पूरी तरह समझ नहीं पाया। क्या आप मुझे आसान शब्दों में बता सकते हैं कि आपको किस तरह की योजना या सहायता चाहिए (जैसे खेती, छात्रवृत्ति, स्वास्थ्य या पेंशन)?"
            if is_hi else
            "I couldn't quite understand that. Could you please tell me in simple words what kind of help you need (e.g. farming, scholarships, health, or pensions)?"
        )
        audio_b64 = None
        if req.synthesize_audio:
            tts_res = await voice_service.synthesize(gibberish_reply, language_code="hi-IN" if is_hi else "en-IN")
            audio_b64 = tts_res.get("audio_base64")
        return AIChatTurnResponse(
            session_id=session_id,
            transcript=stt_transcript or user_text,
            reply=gibberish_reply,
            audio_base64=audio_b64,
            fallback_to_browser_tts=not bool(audio_b64),
            profile=record.profile.raw_attributes or {},
            recognized_attributes={},
            eligible_count=0,
            needs_info_count=0,
            not_eligible_count=0,
            results=[],
            done=False,
            show_results=False,
            results_url="/results"
        )

    # Direct Free-Cost Query Check
    is_cost_query = any(k in lower_text for k in ["kitna paisa", "kitne paise", "kitna paise", "how much does it cost", "fees", "fee", "paisa lagta hai", "charges", "kitna kharcha", "kharcha kitna"])
    if is_cost_query and not any(k in lower_text for k in ["scholarship", "kisan", "pmfby", "loan", "hospital"]):
        cost_reply = (
            "सरकारी योजनाओं के लिए आवेदन करना पूरी तरह निःशुल्क (Free) है। इसके लिए किसी बिचौलिए या दलाल को कोई पैसे नहीं देने होते। बल्कि पात्र होने पर सरकार की तरफ से आपको वित्तीय सहायता और सब्सिडी सीधे बैंक खाते में मिलती है।"
            if is_hi else
            "Applying for government schemes is 100% free of cost with no application fee or intermediary charges. In fact, if eligible, the government provides financial benefits directly to your bank account."
        )
        audio_b64 = None
        if req.synthesize_audio:
            tts_res = await voice_service.synthesize(cost_reply, language_code="hi-IN" if is_hi else "en-IN")
            audio_b64 = tts_res.get("audio_base64")
        return AIChatTurnResponse(
            session_id=session_id,
            transcript=stt_transcript or user_text,
            reply=cost_reply,
            audio_base64=audio_b64,
            fallback_to_browser_tts=not bool(audio_b64),
            profile=record.profile.raw_attributes or {},
            recognized_attributes={},
            eligible_count=0,
            needs_info_count=0,
            not_eligible_count=0,
            results=[],
            done=False,
            show_results=False,
            results_url="/results"
        )
    
    # Check for name introduction: "hi i m kaalu", "i am kaalu", "mera naam kaalu hai", "my name is kaalu"
    name_match = re.search(r'\b(?:i am|i\'m|im|my name is|mera naam|main|mai)\s+([a-zA-Z\u0900-\u097F]+)', clean_text, re.IGNORECASE)
    detected_name = None
    if name_match:
        cand_name = name_match.group(1).strip()
        if cand_name.lower() not in ["a", "an", "the", "ek", "kisan", "farmer", "student", "hoon", "hai", "hu"]:
            detected_name = cand_name.capitalize()

    greeting_keywords = [
        "hi", "hello", "hey", "namaste", "नमस्ते", "pranam", "प्रणाम",
        "hlo", "hii", "start", "shuru", "help", "good morning", "good evening", "namaskar", "नमस्कार"
    ]
    is_greeting_word = any(
        lower_text == g or lower_text.startswith(g + " ") or lower_text.startswith(g + ",") or lower_text.startswith(g + "!")
        for g in greeting_keywords
    )
    is_pure_greeting = (
        not clean_text or
        is_greeting_word or
        bool(re.search(r'^(?:hi|hello|hey|namaste|pranam)\b', lower_text)) or
        (detected_name and len(lower_text.split()) <= 4) or
        len(lower_text) <= 2
    )

    domain_intent = extract_query_intent(clean_text)
    has_scheme_question = bool(domain_intent) or any(
        k in lower_text for k in ["yojana", "scheme", "kisan", "farmer", "scholarship", "chhatravritti", "income", "pension", "fasal"]
    )

    is_uncertain = any(
        lower_text.startswith(p) or lower_text == p
        for p in [
            "not sure", "dont know", "don't know", "no idea", "pata nahi", "maloom nahi",
            "nahi pata", "पता नहीं", "मालूम नहीं", "मुझे नहीं पता", "याद नहीं", "pata nhi"
        ]
    )

    if (is_pure_greeting and not has_scheme_question) or is_uncertain:
        conv_reply = groq_service.generate_conversational_reply(
            user_query=clean_text or "Hello",
            chat_history=getattr(record, "history", []),
            language=active_lang,
            detected_name=detected_name
        )

        audio_b64 = None
        if req.synthesize_audio:
            tts_res = await voice_service.synthesize(conv_reply, language_code="hi-IN" if is_hi else "en-IN")
            audio_b64 = tts_res.get("audio_base64")

        # Record in history
        if not hasattr(record, "history") or record.history is None:
            record.history = []
        record.history.append({"role": "user", "content": clean_text or "Hello"})
        record.history.append({"role": "assistant", "content": conv_reply})

        return AIChatTurnResponse(
            session_id=session_id,
            transcript=stt_transcript or user_text,
            reply=conv_reply,
            audio_base64=audio_b64,
            fallback_to_browser_tts=not bool(audio_b64),
            profile=record.profile.raw_attributes or {},
            recognized_attributes={},
            eligible_count=0,
            needs_info_count=0,
            not_eligible_count=0,
            results=[],
            done=False,
            show_results=False,
            results_url="/results"
        )

    # Record user message in history
    if not hasattr(record, "history") or record.history is None:
        record.history = []
    record.history.append({"role": "user", "content": clean_text})

    # Step 4: Extract structured attributes via Groq 8B (with 3-attempt retry + unit conversion)
    updated_profile, extracted_dict = groq_service.extract_attributes(
        user_text=user_text,
        current_profile=record.profile,
        language=active_lang
    )
    record.profile = updated_profile

    has_meaningful_profile = bool(
        record.profile.occupation or
        record.profile.landholding_hectares is not None or
        record.profile.annual_income is not None or
        record.profile.age is not None
    )

    formatted_results = []
    eligible_count = 0
    needs_info_count = 0
    not_eligible_count = 0
    done = False
    spoken_reply = ""

    # Check for explicit domain query intent (e.g., user asks for education, housing, loan, maternity)
    # The user's current query intent is the HIGHEST PRIORITY!
    # Even if profile is 'farmer', if user asks 'tell me about education', search education schemes!
    domain_intent = extract_query_intent(clean_text)

    # Step 5: Route based on Citizen Intent (Profile Evaluation vs Topic/RAG Search)
    if domain_intent and not (domain_intent.startswith("agriculture") and record.profile.occupation == "Farmer" and (record.profile.landholding_hectares is not None or record.profile.annual_income is not None)):
        # Explicit topic search takes top priority!
        search_query = f"{clean_text} {domain_intent}"
        rag_chunks = await rag_service.search(search_query, top_k=3)

        # Filter chunks to prioritize domain intent (e.g. students if education was asked)
        if domain_intent and domain_intent.startswith("education"):
            domain_chunks = [c for c in rag_chunks if c.get("category") == "students"]
            if domain_chunks:
                rag_chunks = domain_chunks

        if rag_chunks:
            spoken_reply = groq_service.generate_rag_reply(
                user_query=clean_text,
                retrieved_schemes=rag_chunks,
                language=active_lang,
                chat_history=record.history,
                user_occupation=record.profile.occupation or ("Farmer" if "farmer" in clean_text.lower() or "किसान" in clean_text else None)
            )
            formatted_results = format_rag_cards(
                rag_chunks=rag_chunks,
                is_hi=is_hi,
                domain_intent=domain_intent,
                citizen_occupation=record.profile.occupation,
                clean_text=clean_text
            )
            needs_info_count = len(formatted_results)
            done = False
        else:
            spoken_reply = (
                "मुझे अभी सटीक योजना खोजने के लिए पर्याप्त जानकारी नहीं मिली है। क्या आप मुझे अपना पेशा, शिक्षा या आय बता सकते हैं?"
                if is_hi else
                "I don't have enough information to find a matching scheme yet. Could you tell me your occupation, education, or income?"
            )
            formatted_results = []
            done = False

    elif has_meaningful_profile:
        # Run Deterministic Eligibility Engine (Legal Source of Truth)
        schemes_data = await supabase_service.get_schemes_with_criteria()
        eval_resp = eligibility_engine.evaluate(record.profile, schemes_data, language=active_lang)

        spoken_reply = groq_service.generate_explanation(
            eval_resp=eval_resp,
            user_query=clean_text,
            language=active_lang,
            chat_history=record.history
        )

        valid_results = [
            {
                "scheme_id": r.scheme_id,
                "name": r.name,
                "summary": r.summary,
                "category": r.category,
                "status": r.status,
                "passed": r.passed,
                "failed": r.failed,
                "missing": r.missing,
                "benefits": r.benefits,
                "official_url": r.official_url
            }
            for r in eval_resp.results
            if r.status in ["potentially_eligible", "needs_information"]
        ]
        formatted_results = valid_results
        eligible_count = eval_resp.eligible_count
        needs_info_count = eval_resp.needs_info_count
        not_eligible_count = eval_resp.not_eligible_count
        done = eligible_count > 0 or needs_info_count > 0
        if not formatted_results:
            spoken_reply = (
                "मुझे आपके विवरण के अनुसार अभी कोई उपयुक्त सरकारी योजना नहीं मिली। क्या आप अपना पेशा, शिक्षा या अनुमानित आय स्पष्ट रूप से साझा कर सकते हैं?"
                if is_hi else
                "I don't have enough information to find a matching scheme yet. Could you tell me your occupation, education, or income?"
            )

    else:
        # Exploratory / Topical question without explicit keywords
        rag_chunks = await rag_service.search(clean_text, top_k=3)

        # Filter chunks to prioritize domain intent (e.g. students if education was asked)
        if domain_intent and domain_intent.startswith("education"):
            domain_chunks = [c for c in rag_chunks if c.get("category") == "students"]
            if domain_chunks:
                rag_chunks = domain_chunks

        if rag_chunks:
            spoken_reply = groq_service.generate_rag_reply(
                user_query=clean_text,
                retrieved_schemes=rag_chunks,
                language=active_lang,
                chat_history=record.history,
                user_occupation=record.profile.occupation or ("Farmer" if "farmer" in clean_text.lower() or "किसान" in clean_text else None)
            )
            formatted_results = format_rag_cards(
                rag_chunks=rag_chunks,
                is_hi=is_hi,
                domain_intent=domain_intent,
                citizen_occupation=record.profile.occupation,
                clean_text=clean_text
            )
            needs_info_count = len(formatted_results)
            done = False
        else:
            spoken_reply = (
                "मुझे अभी सटीक योजना खोजने के लिए पर्याप्त जानकारी नहीं मिली है। क्या आप मुझे अपना पेशा, शिक्षा या आय बता सकते हैं?"
                if is_hi else
                "I don't have enough information to find a matching scheme yet. Could you tell me your occupation, education, or income?"
            )
            formatted_results = []
            done = False

    # Record bot reply in history (keep last 8 turns)
    record.history.append({"role": "assistant", "content": spoken_reply})
    record.history = record.history[-8:]

    # Step 6: Generate TTS Speech Audio via Sarvam Bulbul (bulbul:v3 with natural 'priya' companion)
    audio_base64 = None
    fallback_browser_tts = False

    if req.synthesize_audio and spoken_reply:
        lang_code = "hi-IN" if active_lang == "hi" else "en-IN"
        tts_res = await voice_service.synthesize(spoken_reply, language_code=lang_code)
        audio_base64 = tts_res.get("audio_base64")
        fallback_browser_tts = tts_res.get("fallback_to_browser_tts", False) or not bool(audio_base64)

    show_results_flag = len(formatted_results) > 0

    return AIChatTurnResponse(
        session_id=session_id,
        transcript=stt_transcript or user_text,
        reply=spoken_reply,
        audio_base64=audio_base64,
        fallback_to_browser_tts=fallback_browser_tts,
        profile=record.profile.raw_attributes or {},
        recognized_attributes=extracted_dict,
        eligible_count=eligible_count,
        needs_info_count=needs_info_count,
        not_eligible_count=not_eligible_count,
        results=formatted_results,
        done=done,
        show_results=show_results_flag,
        results_url="/results"
    )
