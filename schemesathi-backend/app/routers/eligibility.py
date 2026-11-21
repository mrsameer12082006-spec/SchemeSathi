from fastapi import APIRouter, HTTPException, Path, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.models.profile import UserProfile
from app.models.scheme import EvaluationResponse
from app.services.session_store import session_store
from app.services.supabase_service import supabase_service
from app.services.eligibility_engine import eligibility_engine

router = APIRouter(prefix="/api", tags=["Eligibility Evaluation Engine"])

class EvaluateRawRequest(BaseModel):
    """
    Direct evaluation payload for the Voice LLM Agent or external services.
    Enables instant criteria check without creating an explicit session first.
    """
    occupation: Optional[str] = None
    landholding_hectares: Optional[float] = None
    land_ownership: Optional[str] = None
    annual_income: Optional[float] = None
    income_bracket: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    state: Optional[str] = None
    area: Optional[str] = None
    education_level: Optional[str] = None
    caste_category: Optional[str] = None
    raw_attributes: Optional[Dict[str, Any]] = None
    language: str = Field("en", description="'en' or 'hi'")

class ChatMessageRequest(BaseModel):
    session_id: str
    message: str
    language: str = "en"

@router.post("/eligibility/evaluate", response_model=EvaluationResponse, summary="Directly evaluate eligibility from profile parameters")
async def evaluate_direct(payload: EvaluateRawRequest):
    """
    Primary endpoint for the Voice LLM Agent.
    Pass extracted attributes directly, and the Eligibility Engine compares against 
    all 30 schemes from Supabase, returning eligibility statuses, passed/failed rules, 
    and a spoken summary for the voice agent to read out.
    """
    profile = UserProfile(
        occupation=payload.occupation,
        landholding_hectares=payload.landholding_hectares,
        land_ownership=payload.land_ownership,
        annual_income=payload.annual_income,
        income_bracket=payload.income_bracket,
        age=payload.age,
        gender=payload.gender,
        state=payload.state,
        area=payload.area,
        education_level=payload.education_level,
        caste_category=payload.caste_category,
        raw_attributes=payload.raw_attributes or {}
    )

    try:
        schemes_data = await supabase_service.get_schemes_with_criteria()
        return eligibility_engine.evaluate(profile, schemes_data, language=payload.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eligibility evaluation error: {str(e)}")

@router.post("/session/{session_id}/evaluate", response_model=EvaluationResponse, summary="Evaluate active ephemeral session profile")
async def evaluate_session(
    session_id: str = Path(..., description="Active session ID"),
    language: Optional[str] = Query(None, description="Override response language ('en' or 'hi')")
):
    """
    Evaluates the citizen's accumulated profile stored in the ephemeral memory session.
    """
    record = session_store.get_session(session_id)
    if not record:
        raise HTTPException(status_code=404, detail="Session expired or not found")

    target_lang = language or record.language or "en"
    try:
        schemes_data = await supabase_service.get_schemes_with_criteria()
        response = eligibility_engine.evaluate(record.profile, schemes_data, language=target_lang)
        response.session_id = session_id
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eligibility evaluation error: {str(e)}")

<<<<<<< HEAD
@router.post("/chat", summary="Conversational chat endpoint (Delegates to AI Voice & RAG engine)")
async def chat_endpoint(req: ChatMessageRequest):
    """
    Seamless compatibility bridge for SchemeSathi conversational flow.
    Delegates directly to the unified AI Chat + RAG + Voice engine (ai_chat_turn)
    to eliminate hardcoded forms and ensure user intent (e.g. education, health)
    is always directly answered in the citizen's language with voice audio.
    """
    from app.routers.ai_chat import AIChatTurnRequest, ai_chat_turn

    ai_req = AIChatTurnRequest(
        session_id=req.session_id,
        message=req.message,
        language=req.language,
        synthesize_audio=True
    )
    ai_res = await ai_chat_turn(ai_req)

    return {
        "reply": ai_res.reply,
        "audio_base64": ai_res.audio_base64,
        "fallback_to_browser_tts": ai_res.fallback_to_browser_tts,
        "quick_replies": [],
        "why": "",
        "progress": {"answered": 3 if ai_res.done else 2},
        "profile": ai_res.profile,
        "done": ai_res.done,
        "results": ai_res.results,
        "show_results": ai_res.show_results,
        "results_url": ai_res.results_url
=======
@router.post("/chat", summary="Conversational chat endpoint (Frontend compatibility)")
async def chat_endpoint(req: ChatMessageRequest):
    """
    Compatibility bridge for the SchemeSathi frontend conversational flow.
    Ingests message details, asks clarifying questions, and runs evaluation when complete.
    """
    record = session_store.get_session(req.session_id)
    if not record:
        session_res = session_store.create_session(language=req.language)
        record = session_store.get_session(session_res.session_id)

    is_hi = req.language == "hi"
    msg_lower = req.message.lower()

    # Attribute parsing
    if any(k in msg_lower for k in ["farmer", "किसान", "kisan", "खेती"]):
        record.profile.occupation = "किसान" if is_hi else "Farmer"
        record.profile.raw_attributes["पेशा" if is_hi else "Occupation"] = record.profile.occupation
    elif any(k in msg_lower for k in ["student", "छात्र", "विद्यार्थी", "college", "school"]):
        record.profile.occupation = "छात्र" if is_hi else "Student"
        record.profile.raw_attributes["पेशा" if is_hi else "Occupation"] = record.profile.occupation
    elif any(k in msg_lower for k in ["woman", "महिला", "female"]):
        record.profile.occupation = "महिला" if is_hi else "Woman"
        record.profile.raw_attributes["पेशा" if is_hi else "Occupation"] = record.profile.occupation
    elif any(k in msg_lower for k in ["senior", "वृद्ध", "बुजुर्ग", "वरिष्ठ"]):
        record.profile.occupation = "वरिष्ठ नागरिक" if is_hi else "Senior citizen"
        record.profile.raw_attributes["पेशा" if is_hi else "Occupation"] = record.profile.occupation
    elif any(k in msg_lower for k in ["worker", "मज़दूर", "मजदूर", "labour"]):
        record.profile.occupation = "मज़दूर" if is_hi else "Worker"
        record.profile.raw_attributes["पेशा" if is_hi else "Occupation"] = record.profile.occupation
    elif any(k in msg_lower for k in ["business", "दुकान", "व्यापारी", "vendor"]):
        record.profile.occupation = "छोटा व्यापारी" if is_hi else "Small business"
        record.profile.raw_attributes["पेशा" if is_hi else "Occupation"] = record.profile.occupation

    # Land / education / area details
    if "more than 2" in msg_lower or "2 हेक्टेयर से अधिक" in msg_lower:
        record.profile.landholding_hectares = 3.5
        record.profile.raw_attributes["भूमि" if is_hi else "Landholding"] = "2 हेक्टेयर से अधिक" if is_hi else "More than 2 hectares"
    elif "2 hectare" in msg_lower or "2 हेक्टेयर" in msg_lower or "up to 2" in msg_lower:
        record.profile.landholding_hectares = 1.5
        record.profile.raw_attributes["भूमि" if is_hi else "Landholding"] = "2 हेक्टेयर तक" if is_hi else "Up to 2 hectares"
    elif "tenant" in msg_lower or "बटाईदार" in msg_lower or "भूमिहीन" in msg_lower:
        record.profile.land_ownership = "Tenant"
        record.profile.raw_attributes["भूमि" if is_hi else "Landholding"] = "भूमिहीन / बटाईदार" if is_hi else "Tenant / Landless"

    # Income details
    if "below" in msg_lower or "कम" in msg_lower:
        record.profile.annual_income = 75000.0
        record.profile.raw_attributes["वार्षिक आय" if is_hi else "Annual Income"] = "₹1 लाख से कम" if is_hi else "Below ₹1 Lakh"
    elif "above" in msg_lower or "अधिक" in msg_lower:
        record.profile.annual_income = 350000.0
        record.profile.raw_attributes["वार्षिक आय" if is_hi else "Annual Income"] = "₹2.5 लाख से अधिक" if is_hi else "Above ₹2.5 Lakh"
    elif "1" in msg_lower and "2.5" in msg_lower:
        record.profile.annual_income = 180000.0
        record.profile.raw_attributes["वार्षिक आय" if is_hi else "Annual Income"] = "₹1 - ₹2.5 लाख" if is_hi else "₹1 - ₹2.5 Lakh"

    # Step progression
    step = getattr(record, "_chat_step", 0) + 1
    record._chat_step = step

    if step == 1:
        is_farmer = "farmer" in str(record.profile.occupation or "").lower() or "किसान" in str(record.profile.occupation or "")
        is_student = "student" in str(record.profile.occupation or "").lower() or "छात्र" in str(record.profile.occupation or "")
        if is_farmer:
            return {
                "reply": "क्या आपके पास अपनी खेती की ज़मीन है या आप बटाईदार/भूमिहीन मज़दूर हैं?" if is_hi else "Do you own cultivable agricultural land, or do you work as a tenant farmer / laborer?",
                "quick_replies": ["अपनी ज़मीन (2 हेक्टेयर तक)", "अपनी ज़मीन (2 हेक्टेयर से अधिक)", "बटाईदार / भूमिहीन"] if is_hi else ["Own land (up to 2 hectares)", "Own land (more than 2 hectares)", "Tenant farmer / Landless"],
                "why": "अधिकांश किसान योजनाओं में आपके नाम पर ज़मीन के रिकॉर्ड की आवश्यकता होती है।" if is_hi else "Most farmer support schemes require verified landholding records in your name.",
                "progress": {"answered": 1},
                "profile": record.profile.raw_attributes,
                "done": False,
                "results": []
            }
        elif is_student:
            return {
                "reply": "आप वर्तमान में किस कक्षा या पाठ्यक्रम में पढ़ाई कर रहे हैं?" if is_hi else "Which level of education are you currently enrolled in?",
                "quick_replies": ["कक्षा 9 - 10", "कक्षा 11 - 12 / कॉलेज", "स्नातक / उच्च शिक्षा"] if is_hi else ["Class 9 - 10", "Class 11 - 12 / College", "Graduation / Higher Studies"],
                "why": "छात्रवृत्ति योजनाएँ स्कूल, कॉलेज और उच्च शिक्षा के स्तर पर निर्भर करती हैं।" if is_hi else "Scholarship schemes differ between school, college, and post-matric courses.",
                "progress": {"answered": 1},
                "profile": record.profile.raw_attributes,
                "done": False,
                "results": []
            }
        else:
            return {
                "reply": "आप मुख्य रूप से किस क्षेत्र में रहते हैं?" if is_hi else "What is your primary area of residence?",
                "quick_replies": ["ग्रामीण (गाँव / ग्राम पंचायत)", "शहरी (कस्बा / शहर)"] if is_hi else ["Rural (Village / Gram Panchayat)", "Urban (Town / City)"],
                "why": "कुछ कल्याणकारी योजनाएँ केवल ग्रामीण और कुछ केवल शहरी क्षेत्रों के लिए हैं।" if is_hi else "Some social welfare schemes are specific to rural areas while others are urban.",
                "progress": {"answered": 1},
                "profile": record.profile.raw_attributes,
                "done": False,
                "results": []
            }

    elif step == 2:
        return {
            "reply": "आपके पूरे परिवार की अनुमानित वार्षिक आय कितनी है?" if is_hi else "What is your approximate total household annual income?",
            "quick_replies": ["₹1 लाख से कम", "₹1 लाख - ₹2.5 लाख", "₹2.5 लाख से अधिक"] if is_hi else ["Below ₹1 Lakh", "₹1 Lakh - ₹2.5 Lakh", "Above ₹2.5 Lakh"],
            "why": "सरकारी योजनाएँ आय सीमा तय करती हैं ताकि लाभ सही परिवारों तक पहुँचे।" if is_hi else "Government schemes use income thresholds to ensure benefits reach low-income families.",
            "progress": {"answered": 2},
            "profile": record.profile.raw_attributes,
            "done": False,
            "results": []
        }

    # Step >= 3 -> Evaluate against Supabase!
    schemes_data = await supabase_service.get_schemes_with_criteria()
    eval_resp = eligibility_engine.evaluate(record.profile, schemes_data, language=req.language)

    # Format result cards for the frontend
    frontend_results = [
        {
            "scheme_id": r.scheme_id,
            "name": r.name,
            "summary": r.summary,
            "status": r.status,
            "passed": r.passed,
            "failed": r.failed,
            "missing": r.missing
        }
        for r in eval_resp.results
    ]

    return {
        "reply": eval_resp.llm_spoken_summary or ("धन्यवाद। हमने आपके सभी उत्तरों की जाँच कर ली है।" if is_hi else "Thank you. We have completed checking your details against scheme rules."),
        "quick_replies": [],
        "why": "",
        "progress": {"answered": step},
        "profile": record.profile.raw_attributes,
        "done": True,
        "results": frontend_results
>>>>>>> origin/master
    }
