import httpx
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from threading import Lock
import logging

from app.config import get_settings
from app.models.scheme import SchemeSummary, SchemeDetail

logger = logging.getLogger("schemesathi.supabase")

class SupabaseService:
    def __init__(self):
        self.settings = get_settings()
        self._cache_lock = Lock()
        self._cached_schemes_with_criteria: Optional[List[Dict[str, Any]]] = None
        self._cache_expires_at: Optional[datetime] = None

    def _get_headers(self) -> Dict[str, str]:
        key = self.settings.SUPABASE_KEY
        return {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json"
        }

    async def _postgrest_get(self, endpoint: str) -> List[Dict[str, Any]]:
        clean_endpoint = endpoint.lstrip("/")
        url = f"{self.settings.SUPABASE_URL.rstrip('/')}/rest/v1/{clean_endpoint}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(url, headers=self._get_headers())
            res.raise_for_status()
            return res.json()

    async def get_all_schemes(self, language: str = "en") -> List[SchemeSummary]:
        query = "schemes?select=id,code,name_en,name_hi,summary_en,summary_hi,nodal_ministry,is_active,categories(id,code,name_en,name_hi)&is_active=eq.true&order=created_at.asc"
        data = await self._postgrest_get(query)
        is_hi = language == "hi"

        summaries = []
        for item in data:
            cat = item.get("categories") or {}
            summaries.append(
                SchemeSummary(
                    id=item.get("code", ""),
                    db_id=item.get("id"),
                    code=item.get("code", ""),
                    name=(item.get("name_hi") if is_hi and item.get("name_hi") else item.get("name_en", "")),
                    summary=(item.get("summary_hi") if is_hi and item.get("summary_hi") else item.get("summary_en", "")),
                    category=(cat.get("name_hi") if is_hi and cat.get("name_hi") else cat.get("name_en", "General")),
                    category_code=cat.get("code", ""),
                    nodal_ministry=item.get("nodal_ministry", ""),
                    official_url=item.get("official_url", "")
                )
            )
        return summaries

    async def get_scheme_by_code_or_id(self, code_or_id: str, language: str = "en") -> Optional[SchemeDetail]:
        is_uuid = len(code_or_id) == 36 and code_or_id.count("-") == 4
        filter_col = "id" if is_uuid else "code"
        query = f"schemes?{filter_col}=eq.{code_or_id}&select=*,categories(*),scheme_eligibility_criteria(*),scheme_documents(*),scheme_steps(*)&limit=1"
        data = await self._postgrest_get(query)
        if not data:
            return None

        s = data[0]
        cat = s.get("categories") or {}
        is_hi = language == "hi"

        # Sort documents by display_order
        raw_docs = sorted(s.get("scheme_documents") or [], key=lambda d: d.get("display_order", 0))
        documents = [
            (doc.get("document_name_hi") if is_hi and doc.get("document_name_hi") else doc.get("document_name_en", ""))
            for doc in raw_docs
        ]

        # Sort steps by step_number
        raw_steps = sorted(s.get("scheme_steps") or [], key=lambda st: st.get("step_number", 0))
        steps = []
        for st in raw_steps:
            title = st.get("title_hi") if is_hi and st.get("title_hi") else st.get("title_en", "")
            desc = st.get("description_hi") if is_hi and st.get("description_hi") else st.get("description_en", "")
            if title and desc and title != desc:
                steps.append(f"{title}: {desc}")
            else:
                steps.append(desc or title or "")

        last_verified_str = s.get("updated_at") or s.get("created_at")
        last_verified = None
        if last_verified_str:
            try:
                dt = datetime.fromisoformat(last_verified_str.replace("Z", "+00:00"))
                last_verified = dt.strftime("%d %b %Y")
            except Exception:
                last_verified = last_verified_str[:10]

        return SchemeDetail(
            id=s.get("code", ""),
            db_id=s.get("id"),
            code=s.get("code", ""),
            name=(s.get("name_hi") if is_hi and s.get("name_hi") else s.get("name_en", "")),
            summary=(s.get("summary_hi") if is_hi and s.get("summary_hi") else s.get("summary_en", "")),
            category=(cat.get("name_hi") if is_hi and cat.get("name_hi") else cat.get("name_en", "General")),
            category_code=cat.get("code", ""),
            nodal_ministry=s.get("nodal_ministry", ""),
            benefits=(s.get("benefits_hi") if is_hi and s.get("benefits_hi") else s.get("benefits_en", "")),
            official_url=s.get("official_url", ""),
            documents=documents,
            steps=steps,
            last_verified=last_verified,
            demo=False
        )

    async def get_schemes_with_criteria(self, force_refresh: bool = False) -> List[Dict[str, Any]]:
        """
        Fetches all active schemes with their criteria, documents, and steps for the Eligibility Engine.
        Uses cached data if within TTL for ultra-fast evaluations.
        """
        now = datetime.now(timezone.utc)
        with self._cache_lock:
            if not force_refresh and self._cached_schemes_with_criteria and self._cache_expires_at and now < self._cache_expires_at:
                return self._cached_schemes_with_criteria

        logger.info("Refreshing schemes & criteria catalog from Supabase...")
        query = "schemes?select=*,categories(*),scheme_eligibility_criteria(*),scheme_documents(*),scheme_steps(*)&is_active=eq.true"
        data = await self._postgrest_get(query)

        cache_ttl = self.settings.SCHEME_CACHE_TTL_MINUTES
        with self._cache_lock:
            self._cached_schemes_with_criteria = data
            self._cache_expires_at = now + timedelta(minutes=cache_ttl)

        logger.info(f"Loaded {len(data)} active schemes with criteria into memory cache.")
        return data

# Global singleton supabase service instance
supabase_service = SupabaseService()
