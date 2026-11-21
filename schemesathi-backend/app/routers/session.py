from fastapi import APIRouter, HTTPException, Path
from typing import Dict, Any

from app.models.profile import SessionCreateRequest, SessionResponse, IngestProfileRequest, UserProfile
from app.services.session_store import session_store

router = APIRouter(prefix="/api/session", tags=["Session & Citizen Profile"])

@router.post("", response_model=SessionResponse, summary="Initialize anonymous ephemeral session")
async def create_session(req: SessionCreateRequest = SessionCreateRequest()):
    """
    Creates an ephemeral session held strictly in volatile RAM.
    Guarantees 0 persistent records, cookies, or database tracking.
    """
    return session_store.create_session(language=req.language)

@router.get("/{session_id}", response_model=SessionResponse, summary="Get session profile")
async def get_session(session_id: str = Path(..., description="Active session ID")):
    record = session_store.get_session(session_id)
    if not record:
        raise HTTPException(status_code=404, detail="Session expired or not found")
    return SessionResponse(
        session_id=record.session_id,
        created_at=record.created_at.isoformat(),
        language=record.language,
        profile=record.profile
    )

@router.post("/{session_id}/profile", response_model=UserProfile, summary="Ingest profile attributes from Voice LLM agent or user")
async def ingest_profile(
    session_id: str = Path(..., description="Active session ID"),
    payload: IngestProfileRequest = IngestProfileRequest()
):
    """
    Called by the Voice LLM Agent or conversational frontend to feed
    extracted citizen parameters into memory.
    """
    updated = session_store.update_profile(session_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Session expired or not found")
    return updated

@router.delete("/{session_id}", summary="Explicitly purge session data immediately")
async def delete_session(session_id: str = Path(..., description="Session ID to destroy")):
    """
    Purges all citizen information from RAM immediately.
    Triggered when the user closes browser window or clicks 'Start Again'.
    """
    deleted = session_store.delete_session(session_id)
    return {
        "success": deleted,
        "message": "All session data completely erased from memory" if deleted else "Session not found"
    }

@router.post("/{session_id}/purge", summary="Purge alias for Beacon / Webhook close")
async def purge_session_post(session_id: str = Path(..., description="Session ID to destroy")):
    deleted = session_store.delete_session(session_id)
    return {
        "success": deleted,
        "message": "All session data completely erased from memory" if deleted else "Session not found"
    }
