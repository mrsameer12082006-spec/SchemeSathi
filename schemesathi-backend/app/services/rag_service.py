import os
import json
import math
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
import httpx

from app.config import get_settings

logger = logging.getLogger("schemesathi.rag")

CACHE_FILE = Path(__file__).resolve().parent.parent.parent.parent / "data" / "scheme_embeddings_cache.json"


def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """Computes cosine similarity between two float vectors."""
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1)) or 1e-9
    norm2 = math.sqrt(sum(b * b for b in v2)) or 1e-9
    return dot / (norm1 * norm2)


class RAGService:
    """
    Retrieval-Augmented Generation (RAG) Service:
    - Queries Supabase pgvector stored procedure `match_scheme_embeddings` (private service_role)
    - Automatically falls back to high-speed in-memory vector search over local cache if cloud DB not connected
    - Provides semantic context for specific citizen inquiries (documents, rules, steps)
    """

    def __init__(self):
        self.settings = get_settings()
        self._local_cache: Optional[List[Dict[str, Any]]] = None
        self._model = None
        self._load_local_cache()

    def _load_local_cache(self):
        if CACHE_FILE.exists():
            try:
                with open(CACHE_FILE, "r", encoding="utf-8") as f:
                    self._local_cache = json.load(f)
                logger.info(f"Loaded {len(self._local_cache)} scheme embeddings into local memory cache.")
            except Exception as e:
                logger.warning(f"Could not load local embedding cache: {e}")

    def _get_query_embedding(self, query: str) -> List[float]:
        """Generates embedding for search query."""
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                model_name = os.environ.get("EMBEDDING_MODEL", "paraphrase-multilingual-MiniLM-L12-v2")
                try:
                    self._model = SentenceTransformer(model_name)
                except Exception:
                    self._model = SentenceTransformer("all-MiniLM-L6-v2")
            except Exception:
                self._model = None

        if self._model is not None:
            emb = self._model.encode(query, normalize_embeddings=True)
            return [round(float(x), 6) for x in emb]

        # Deterministic hashing fallback
        import hashlib
        dim = 384
        vec = [0.0] * dim
        for i, word in enumerate(query.lower().split()):
            h = int(hashlib.md5(word.encode()).hexdigest(), 16)
            vec[h % dim] += 1.0 / (1.0 + math.log(i + 1))
        norm = math.sqrt(sum(x * x for x in vec)) or 1.0
        return [round(x / norm, 6) for x in vec]

    async def search(self, query: str, top_k: int = 3, match_threshold: float = 0.25) -> List[Dict[str, Any]]:
        """
        Hybrid semantic retrieval:
        Tries Supabase pgvector RPC first; falls back to in-memory cosine ranking.
        """
        query_vec = self._get_query_embedding(query)

        # 1. Try Supabase pgvector RPC if credentials present
        supabase_url = getattr(self.settings, "SUPABASE_URL", "")
        service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or getattr(self.settings, "SUPABASE_KEY", "")

        if supabase_url and service_key and not service_key.startswith("sb_publishable_"):
            try:
                rpc_url = f"{supabase_url.rstrip('/')}/rest/v1/rpc/match_scheme_embeddings"
                headers = {
                    "apikey": service_key,
                    "Authorization": f"Bearer {service_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "query_embedding": query_vec,
                    "match_threshold": match_threshold,
                    "match_count": top_k
                }
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.post(rpc_url, headers=headers, json=payload)
                    if resp.status_code == 200:
                        results = resp.json()
                        if results:
                            logger.info(f"Supabase pgvector matched {len(results)} chunks for query: '{query[:40]}'")
                            return results
            except Exception as e:
                logger.debug(f"Supabase vector RPC fallback: {e}")

        # 2. Local in-memory cosine similarity search fallback
        if not self._local_cache:
            self._load_local_cache()

        if not self._local_cache:
            return []

        scored = []
        for chunk in self._local_cache:
            emb = chunk.get("embedding")
            if not emb:
                continue
            sim = cosine_similarity(query_vec, emb)
            if sim >= match_threshold:
                scored.append({
                    "scheme_code": chunk.get("scheme_code"),
                    "scheme_name_en": chunk.get("scheme_name_en"),
                    "scheme_name_hi": chunk.get("scheme_name_hi"),
                    "category": chunk.get("category"),
                    "chunk_title": chunk.get("chunk_title"),
                    "chunk_type": chunk.get("chunk_type"),
                    "content": chunk.get("content"),
                    "similarity": round(sim, 4)
                })

        scored.sort(key=lambda x: x["similarity"], reverse=True)
        if scored:
            return scored[:top_k]

        # 3. Keyword fallback search over data/top_40_schemes.json if vector search produced 0 results
        return self.keyword_search(query, top_k=top_k)

    def keyword_search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Fast keyword-based search fallback over data/top_40_schemes.json.
        Protects against vector database / embedding failures.
        """
        import re
        top_40_path = Path(__file__).resolve().parent.parent.parent.parent / "data" / "top_40_schemes.json"
        if not top_40_path.exists():
            return []

        try:
            with open(top_40_path, "r", encoding="utf-8") as f:
                schemes = json.load(f)
        except Exception:
            return []

        STOP_WORDS = {"scheme", "schemes", "yojana", "yojanaye", "for", "the", "and", "with", "year", "years", "old", "about", "tell", "kya", "hai", "hain", "mujhe", "chahiye"}
        query_tokens = [w for w in re.findall(r'\w+', query.lower()) if len(w) > 2 and w not in STOP_WORDS]
        if not query_tokens:
            return []

        scored = []
        for s in schemes:
            score = 0
            searchable = (
                f"{s.get('name_en', '')} {s.get('name_hi', '')} {s.get('category', '')} "
                f"{s.get('summary_en', '')} {s.get('summary_hi', '')} {s.get('nodal_ministry', '')}"
            ).lower()

            for token in query_tokens:
                pat = r'\b' + re.escape(token) + r'\b'
                if re.search(pat, s.get("name_en", "").lower()) or re.search(pat, s.get("name_hi", "").lower()):
                    score += 20
                elif re.search(pat, s.get("category", "").lower()):
                    score += 15
                elif re.search(pat, searchable):
                    score += 5

            if score > 0:
                scored.append({
                    "scheme_code": s.get("code"),
                    "scheme_name_en": s.get("name_en"),
                    "scheme_name_hi": s.get("name_hi"),
                    "category": s.get("category"),
                    "chunk_title": f"{s.get('name_en')} - Overview",
                    "chunk_type": "overview",
                    "content": s.get("summary_en", ""),
                    "similarity": round(min(1.0, 0.4 + (score * 0.05)), 4),
                    "_score": score
                })

        scored.sort(key=lambda x: x["_score"], reverse=True)
        return scored[:top_k]


# Global singleton instance
rag_service = RAGService()
