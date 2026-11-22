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
        "reply_en": ai_res.reply_en,
        "reply_hi": ai_res.reply_hi,
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
    }
