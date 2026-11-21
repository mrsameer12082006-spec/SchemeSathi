"""
WebSocket Voice Agent Endpoint for SchemeSathi.

Real-time voice conversation: receive audio → STT → LLM extraction →
eligibility evaluation → LLM response → TTS → send audio back.

Also supports text-mode fallback for non-voice clients.
"""

import json
import logging
from typing import Optional, List, Dict, Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from app.models.profile import UserProfile, IngestProfileRequest
from app.services.session_store import session_store
from app.services.supabase_service import supabase_service
from app.services.eligibility_engine import eligibility_engine
from app.services.llm_service import llm_service
from app.services.voice_service import voice_service, VoiceService, NoopVoiceService

logger = logging.getLogger("schemesathi.voice_agent")

router = APIRouter(tags=["Voice Agent"])


def _merge_extracted_profile(
    existing: UserProfile, extracted: UserProfile
) -> UserProfile:
    """Merge newly extracted fields into the existing profile (non-null only)."""
    extracted_dict = extracted.model_dump(exclude_none=True)

    # Merge raw_attributes separately to avoid overwriting
    new_raw = extracted_dict.pop("raw_attributes", {})

    for field, value in extracted_dict.items():
        if value is not None:
            setattr(existing, field, value)

    if new_raw:
        existing.raw_attributes.update(new_raw)

    return existing


def _collect_missing_fields(
    results: list,
) -> List[str]:
    """Collect unique missing criteria from evaluation results."""
    missing = []
    seen = set()
    for r in results:
        for m in getattr(r, "missing", []):
            if m not in seen:
                seen.add(m)
                missing.append(m)
    return missing


@router.websocket("/ws/voice")
async def voice_agent_ws(websocket: WebSocket):
    """
    WebSocket endpoint for real-time voice conversation.
    
    **Client → Server message format (JSON):**
    ```json
    {
        "type": "audio" | "text",
        "session_id": "sess_xxxx",        // Optional, auto-created if missing
        "language": "hi" | "en",           // Default: "hi"
        "audio_base64": "...",             // Required when type=audio
        "text": "...",                     // Required when type=text
        "end_session": false               // Set true to close
    }
    ```
    
    **Server → Client message format (JSON):**
    ```json
    {
        "type": "response",
        "session_id": "sess_xxxx",
        "text": "...",                     // Response text
        "audio_base64": "...",             // TTS audio (if voice enabled)
        "profile": {...},                  // Current known profile
        "quick_replies": [...],            // Suggested follow-up options
        "done": false,                     // True when evaluation complete
        "results": [...]                   // Evaluation results (when done)
    }
    ```
    """
    await websocket.accept()
    logger.info("WebSocket voice agent connection accepted")

    # Per-connection conversation history for multi-turn context
    conversation_history: List[Dict[str, str]] = []
    active_session_id: Optional[str] = None

    try:
        while True:
            raw = await websocket.receive_text()

            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json(
                    {"type": "error", "message": "Invalid JSON"}
                )
                continue

            # ─── Parse incoming message ───────────────────────────────
            msg_type = msg.get("type", "text")
            session_id = msg.get("session_id") or active_session_id
            language = msg.get("language", "hi")
            end_session = msg.get("end_session", False)

            # Handle session end request
            if end_session:
                if session_id:
                    session_store.delete_session(session_id)
                await websocket.send_json(
                    {"type": "session_ended", "session_id": session_id}
                )
                await websocket.close()
                return

            # ─── Get or create session ────────────────────────────────
            if session_id:
                record = session_store.get_session(session_id)
            else:
                record = None

            if record is None:
                session_resp = session_store.create_session(language=language)
                session_id = session_resp.session_id
                record = session_store.get_session(session_id)
                logger.info(f"Created new session {session_id} for WS client")

            active_session_id = session_id

            # ─── Step 1: Get user text ────────────────────────────────
            user_text = ""

            if msg_type == "audio" and msg.get("audio_base64"):
                # STT: Convert audio to text
                try:
                    lang_code = "hi-IN" if language == "hi" else "en-IN"
                    user_text, detected_lang = await voice_service.speech_to_text(
                        msg["audio_base64"], language_code=lang_code
                    )
                    if detected_lang:
                        language = "hi" if "hi" in detected_lang else "en"
                    logger.info(f"STT result: '{user_text[:80]}...'")
                except Exception as e:
                    logger.error(f"STT failed: {e}")
                    await websocket.send_json(
                        {
                            "type": "error",
                            "session_id": session_id,
                            "message": f"Speech recognition failed: {str(e)}",
                        }
                    )
                    continue
            elif msg_type == "text" and msg.get("text"):
                user_text = msg["text"]
            else:
                await websocket.send_json(
                    {
                        "type": "error",
                        "session_id": session_id,
                        "message": "No audio or text provided",
                    }
                )
                continue

            if not user_text.strip():
                await websocket.send_json(
                    {
                        "type": "error",
                        "session_id": session_id,
                        "message": "Could not understand the audio. Please try again.",
                    }
                )
                continue

            # Add to conversation history
            conversation_history.append({"role": "user", "content": user_text})

            # ─── Step 2: LLM Attribute Extraction ─────────────────────
            try:
                extracted_profile = await llm_service.extract_profile(
                    user_message=user_text,
                    conversation_history=conversation_history,
                    existing_profile=record.profile,
                )
                # Merge into session profile
                record.profile = _merge_extracted_profile(
                    record.profile, extracted_profile
                )
            except Exception as e:
                logger.error(f"LLM extraction failed: {e}")
                # Continue with existing profile — non-fatal

            # ─── Step 3: Run Eligibility Engine ───────────────────────
            try:
                schemes_data = await supabase_service.get_schemes_with_criteria()
                evaluation = eligibility_engine.evaluate(
                    record.profile, schemes_data, language=language
                )
            except Exception as e:
                logger.error(f"Eligibility evaluation failed: {e}")
                await websocket.send_json(
                    {
                        "type": "error",
                        "session_id": session_id,
                        "message": "Evaluation service temporarily unavailable.",
                    }
                )
                continue

            # ─── Step 4: Determine if we have enough info ─────────────
            missing_fields = _collect_missing_fields(evaluation.results)
            profile_dict = record.profile.model_dump(exclude_none=True)
            profile_dict.pop("raw_attributes", None)
            filled_count = len(profile_dict)
            done = filled_count >= 3 and not missing_fields

            # ─── Step 5: Generate response ────────────────────────────
            response_text = ""
            quick_replies: List[str] = []

            if done or filled_count >= 3:
                # Enough info — generate evaluation summary
                try:
                    response_text = await llm_service.generate_response(
                        evaluation=evaluation,
                        user_message=user_text,
                        language=language,
                        conversation_history=conversation_history,
                    )
                except Exception:
                    response_text = evaluation.llm_spoken_summary or ""
                done = True
            else:
                # Need more info — generate follow-up question
                try:
                    followup = await llm_service.generate_followup_question(
                        missing_fields=missing_fields,
                        profile=record.profile,
                        language=language,
                    )
                    if followup:
                        response_text = followup.get("question", "")
                        quick_replies = followup.get("quick_replies", [])
                except Exception:
                    # Fallback follow-up
                    response_text = (
                        "कृपया अपनी आय, उम्र, या ज़मीन के बारे में बताइए।"
                        if language == "hi"
                        else "Please tell me about your income, age, or landholding."
                    )

            # Add assistant response to conversation history
            conversation_history.append({"role": "assistant", "content": response_text})

            # ─── Step 6: TTS (if voice enabled) ───────────────────────
            audio_base64_out: Optional[str] = None
            if response_text and not isinstance(voice_service, NoopVoiceService):
                try:
                    lang_code = "hi-IN" if language == "hi" else "en-IN"
                    audio_base64_out = await voice_service.text_to_speech(
                        response_text, language_code=lang_code
                    )
                except Exception as e:
                    logger.error(f"TTS failed: {e}")
                    # Non-fatal — client still gets text response

            # ─── Step 7: Build and send response ──────────────────────
            # Format results for the client
            frontend_results = []
            if done:
                frontend_results = [
                    {
                        "scheme_id": r.scheme_id,
                        "name": r.name,
                        "summary": r.summary,
                        "status": r.status,
                        "passed": r.passed,
                        "failed": r.failed,
                        "missing": r.missing,
                        "benefits": r.benefits,
                        "official_url": r.official_url,
                    }
                    for r in evaluation.results
                ]

            response_payload = {
                "type": "response",
                "session_id": session_id,
                "transcript": user_text,
                "text": response_text,
                "profile": record.profile.model_dump(exclude_none=True),
                "quick_replies": quick_replies,
                "done": done,
                "results": frontend_results,
            }
            if audio_base64_out:
                response_payload["audio_base64"] = audio_base64_out

            await websocket.send_json(response_payload)

    except WebSocketDisconnect:
        logger.info(
            f"WebSocket client disconnected (session: {active_session_id})"
        )
    except Exception as e:
        logger.error(f"WebSocket error: {e}", exc_info=True)
        try:
            await websocket.send_json(
                {"type": "error", "message": f"Internal error: {str(e)}"}
            )
            await websocket.close()
        except Exception:
            pass
