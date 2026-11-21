import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Optional, Any
from threading import Lock
import logging

from app.models.profile import UserProfile, SessionResponse, IngestProfileRequest
from app.config import get_settings

logger = logging.getLogger("schemesathi.session")

class SessionRecord:
    def __init__(self, session_id: str, language: str = "en"):
        self.session_id = session_id
        self.language = language
        self.created_at = datetime.now(timezone.utc)
        self.last_active = datetime.now(timezone.utc)
        self.profile = UserProfile()
        self.history = []

class EphemeralSessionStore:
    """
    Privacy-First Ephemeral In-Memory Session Store.
    
    Guarantees:
    - Never writes any citizen PII to persistent storage, database, or disk logs.
    - All state is held in volatile server RAM only.
    - Sessions expire and are purged automatically after TTL (default: 30 minutes).
    - Supports immediate purging via delete_session() when browser tab closes.
    """
    def __init__(self):
        self._store: Dict[str, SessionRecord] = {}
        self._lock = Lock()

    def create_session(self, language: str = "en") -> SessionResponse:
        session_id = f"sess_{uuid.uuid4().hex[:12]}"
        with self._lock:
            record = SessionRecord(session_id, language=language)
            self._store[session_id] = record

        logger.info(f"Created anonymous ephemeral session {session_id} (lang: {language})")
        return SessionResponse(
            session_id=record.session_id,
            created_at=record.created_at.isoformat(),
            language=record.language,
            profile=record.profile
        )

    def get_session(self, session_id: str) -> Optional[SessionRecord]:
        with self._lock:
            record = self._store.get(session_id)
            if not record:
                return None
            
            # Check if expired
            ttl_minutes = get_settings().SESSION_TTL_MINUTES
            if datetime.now(timezone.utc) - record.last_active > timedelta(minutes=ttl_minutes):
                del self._store[session_id]
                logger.info(f"Purged expired session {session_id}")
                return None

            record.last_active = datetime.now(timezone.utc)
            return record

    def update_profile(self, session_id: str, ingest: IngestProfileRequest) -> Optional[UserProfile]:
        record = self.get_session(session_id)
        if not record:
            return None

        with self._lock:
            if ingest.language:
                record.language = ingest.language

            # Update structured profile fields if supplied
            if ingest.occupation is not None:
                record.profile.occupation = ingest.occupation
            if ingest.landholding_hectares is not None:
                record.profile.landholding_hectares = ingest.landholding_hectares
            if ingest.land_ownership is not None:
                record.profile.land_ownership = ingest.land_ownership
            if ingest.annual_income is not None:
                record.profile.annual_income = ingest.annual_income
            if ingest.income_bracket is not None:
                record.profile.income_bracket = ingest.income_bracket
            if ingest.age is not None:
                record.profile.age = ingest.age
            if ingest.gender is not None:
                record.profile.gender = ingest.gender
            if ingest.state is not None:
                record.profile.state = ingest.state
            if ingest.area is not None:
                record.profile.area = ingest.area
            if ingest.education_level is not None:
                record.profile.education_level = ingest.education_level
            if ingest.caste_category is not None:
                record.profile.caste_category = ingest.caste_category

            # Merge raw attributes
            if ingest.raw_attributes:
                record.profile.raw_attributes.update(ingest.raw_attributes)

            record.last_active = datetime.now(timezone.utc)
            return record.profile

    def delete_session(self, session_id: str) -> bool:
        """
        Explicitly and immediately purges user profile data from RAM.
        Called when the user closes their browser window or resets chat.
        """
        with self._lock:
            if session_id in self._store:
                del self._store[session_id]
                logger.info(f"Explicitly destroyed session {session_id} - all data purged")
                return True
            return False

    def cleanup_expired(self) -> int:
        """
        Background maintenance: removes all expired sessions.
        """
        ttl_minutes = get_settings().SESSION_TTL_MINUTES
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=ttl_minutes)
        purged = 0

        with self._lock:
            expired_keys = [sid for sid, rec in self._store.items() if rec.last_active < cutoff]
            for sid in expired_keys:
                del self._store[sid]
                purged += 1

        if purged > 0:
            logger.info(f"Swept memory: purged {purged} expired anonymous sessions")
        return purged

# Global singleton session store instance
session_store = EphemeralSessionStore()
