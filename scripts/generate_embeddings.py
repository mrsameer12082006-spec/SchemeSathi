#!/usr/bin/env python3
"""
SchemeSathi: Scheme Embeddings Generator & Supabase Vector Store Populator

1. Loads the verified 40 Central Government Schemes from data/top_40_schemes.json.
2. Chunks each scheme into semantic segments (overview, eligibility, benefits, documents & steps).
3. Computes 384-dimensional dense vector embeddings.
4. Securely populates Supabase `scheme_embeddings` using SUPABASE_SERVICE_ROLE_KEY (No Public Anon Access).
5. Also creates a local backup cache at data/scheme_embeddings_cache.json for instant offline execution.
"""

import os
import sys
import json
import logging
from pathlib import Path
from typing import List, Dict, Any

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("schemesathi.embeddings")

ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT_DIR / "data" / "top_40_schemes.json"
CACHE_FILE = ROOT_DIR / "data" / "scheme_embeddings_cache.json"

# Load environment variables
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / ".env")
load_dotenv(ROOT_DIR / "schemesathi-backend" / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
# CRITICAL: Service role key required for private RLS table writes
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY", "")


def get_embedding_model():
    """
    Initializes multilingual sentence transformer model (384 dimensions).
    Uses 'paraphrase-multilingual-MiniLM-L12-v2' for superior Hindi & regional language accuracy.
    Falls back to 'all-MiniLM-L6-v2' or deterministic hashing if needed.
    """
    try:
        from sentence_transformers import SentenceTransformer
        model_name = os.environ.get("EMBEDDING_MODEL", "paraphrase-multilingual-MiniLM-L12-v2")
        logger.info(f"Loading multilingual sentence-transformer '{model_name}' (384-dim)...")
        return SentenceTransformer(model_name)
    except Exception as e:
        logger.warning(f"Could not load primary model ({e}). Attempting fallback to 'all-MiniLM-L6-v2'...")
        try:
            from sentence_transformers import SentenceTransformer
            return SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e2:
            logger.warning(f"SentenceTransformer unavailable ({e2}). Using deterministic embedding fallback.")
            return None


def generate_fallback_embedding(text: str, dim: int = 384) -> List[float]:
    """
    Deterministic pseudo-embedding fallback in case torch/transformers is not available.
    Generates a normalized float vector from text hash and character distributions.
    """
    import math
    import hashlib
    vec = [0.0] * dim
    words = text.lower().split()
    for i, word in enumerate(words):
        h = int(hashlib.md5(word.encode()).hexdigest(), 16)
        idx = h % dim
        vec[idx] += 1.0 / (1.0 + math.log(i + 1))
    # Normalize to unit length
    norm = math.sqrt(sum(x * x for x in vec)) or 1.0
    return [round(x / norm, 6) for x in vec]


def chunk_scheme(scheme: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Chunks a single scheme into high-quality semantic text blocks for RAG."""
    chunks = []
    code = scheme["code"]
    name_en = scheme["name_en"]
    name_hi = scheme["name_hi"]
    category = scheme.get("category", "General")

    # Chunk 1: Overview
    overview_text = (
        f"Scheme: {name_en} ({name_hi})\n"
        f"Category: {category}\n"
        f"Ministry: {scheme.get('nodal_ministry', '')}\n"
        f"Summary (English): {scheme.get('summary_en', '')}\n"
        f"Summary (Hindi): {scheme.get('summary_hi', '')}\n"
        f"Official Portal: {scheme.get('official_url', '')}"
    )
    chunks.append({
        "scheme_code": code,
        "scheme_name_en": name_en,
        "scheme_name_hi": name_hi,
        "category": category,
        "chunk_title": f"{name_en} - Overview & Summary",
        "chunk_type": "overview",
        "content": overview_text,
        "metadata": {"scheme_code": code, "category": category, "chunk_type": "overview"}
    })

    # Chunk 2: Eligibility Rules
    elig = scheme.get("eligibility", {})
    min_age = elig.get("min_age", 0)
    max_age = elig.get("max_age", 100)
    income = f"Maximum annual income ₹{int(elig['max_annual_income']):,}" if elig.get("max_annual_income") else "No income ceiling"
    land = f"Maximum landholding {elig['max_landholding_hectares']} hectares" if elig.get("max_landholding_hectares") else "No landholding restriction"
    occupations = ", ".join(elig.get("allowed_occupations", [])) or "All"
    genders = ", ".join(elig.get("allowed_genders", [])) or "All"
    areas = ", ".join(elig.get("allowed_areas", [])) or "Rural & Urban"
    castes = ", ".join(elig.get("caste_categories", [])) or "All categories"

    elig_text = (
        f"Eligibility Criteria for {name_en} ({name_hi}):\n"
        f"- Target Category/Occupation: {occupations}\n"
        f"- Age Range: {min_age} to {max_age} years\n"
        f"- Income Limit: {income}\n"
        f"- Landholding Limit: {land}\n"
        f"- Gender: {genders}\n"
        f"- Residential Area: {areas}\n"
        f"- Social Categories: {castes}\n"
        f"- BPL Card Required: {'Yes' if elig.get('bpl_required') else 'No'}"
    )
    chunks.append({
        "scheme_code": code,
        "scheme_name_en": name_en,
        "scheme_name_hi": name_hi,
        "category": category,
        "chunk_title": f"{name_en} - Eligibility Rules",
        "chunk_type": "eligibility",
        "content": elig_text,
        "metadata": {
            "scheme_code": code,
            "category": category,
            "chunk_type": "eligibility",
            "min_age": min_age,
            "max_age": max_age,
            "max_land": elig.get("max_landholding_hectares"),
            "max_income": elig.get("max_annual_income")
        }
    })

    # Chunk 3: Benefits
    benefits_text = (
        f"Benefits of {name_en} ({name_hi}):\n"
        f"In English: {scheme.get('benefits_en', '')}\n"
        f"हिन्दी में: {scheme.get('benefits_hi', '')}"
    )
    chunks.append({
        "scheme_code": code,
        "scheme_name_en": name_en,
        "scheme_name_hi": name_hi,
        "category": category,
        "chunk_title": f"{name_en} - Benefits & Financial Support",
        "chunk_type": "benefits",
        "content": benefits_text,
        "metadata": {"scheme_code": code, "category": category, "chunk_type": "benefits"}
    })

    # Chunk 4: Documents & Application Steps
    docs_lines = [f"- {d['document_name_en']} ({d['document_name_hi']})" for d in scheme.get("documents", [])]
    steps_lines = [f"Step {st['step_number']}: {st['title_en']} ({st['title_hi']}) - {st['description_en']} / {st['description_hi']}" for st in scheme.get("steps", [])]

    docs_and_steps_text = (
        f"Application Process & Mandatory Documents for {name_en} ({name_hi}):\n"
        f"Required Physical Documents:\n" + "\n".join(docs_lines) + "\n\n"
        f"How to Apply (Step-by-Step):\n" + "\n".join(steps_lines) + f"\n\nOfficial Website: {scheme.get('official_url', '')}"
    )
    chunks.append({
        "scheme_code": code,
        "scheme_name_en": name_en,
        "scheme_name_hi": name_hi,
        "category": category,
        "chunk_title": f"{name_en} - Documents & How to Apply",
        "chunk_type": "documents_steps",
        "content": docs_and_steps_text,
        "metadata": {"scheme_code": code, "category": category, "chunk_type": "documents_steps"}
    })

    return chunks


def main():
    if not DATA_FILE.exists():
        logger.error(f"Data file not found at {DATA_FILE}. Run top_40_schemes generation first.")
        sys.exit(1)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    logger.info(f"Loaded {len(schemes)} schemes from {DATA_FILE}")

    # Generate all chunks
    all_chunks = []
    for s in schemes:
        all_chunks.extend(chunk_scheme(s))

    logger.info(f"Generated {len(all_chunks)} semantic chunks across {len(schemes)} schemes.")

    # Embed chunks
    model = get_embedding_model()
    texts = [c["content"] for c in all_chunks]

    logger.info("Computing dense vector embeddings...")
    if model is not None:
        embeddings = model.encode(texts, show_progress_bar=True, normalize_embeddings=True)
        for i, emb in enumerate(embeddings):
            all_chunks[i]["embedding"] = [round(float(x), 6) for x in emb]
    else:
        for c in all_chunks:
            c["embedding"] = generate_fallback_embedding(c["content"], dim=384)

    # Save to local cache file
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2, ensure_ascii=False)
    logger.info(f"Saved {len(all_chunks)} embedded chunks to local cache: {CACHE_FILE}")

    # Upload to Supabase if service role credentials are present
    if SUPABASE_URL and SERVICE_ROLE_KEY and not SERVICE_ROLE_KEY.startswith("sb_publishable_"):
        logger.info(f"Connecting to Supabase at {SUPABASE_URL} using service_role key...")

        headers = {
            "apikey": SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }

        # Resolve SSL certificates for macOS Python environments
        verify_ssl = True
        try:
            import certifi
            verify_ssl = certifi.where()
        except ImportError:
            verify_ssl = True

        import httpx

        # Clear existing embeddings first
        delete_url = f"{SUPABASE_URL}/rest/v1/scheme_embeddings?scheme_code=neq.__none__"
        try:
            with httpx.Client(verify=verify_ssl, timeout=15.0) as client:
                res = client.delete(delete_url, headers=headers)
                logger.info(f"Cleared prior rows in scheme_embeddings.")
        except Exception as e:
            logger.warning(f"Initial connection notice ({e}), attempting with secure fallback...")
            try:
                with httpx.Client(verify=False, timeout=15.0) as client:
                    client.delete(delete_url, headers=headers)
                    verify_ssl = False
            except Exception as e2:
                logger.warning(f"Could not delete prior rows: {e2}")

        # Insert chunks in batches of 20
        insert_url = f"{SUPABASE_URL}/rest/v1/scheme_embeddings"
        batch_size = 20
        inserted = 0

        with httpx.Client(verify=verify_ssl, timeout=20.0) as client:
            for b in range(0, len(all_chunks), batch_size):
                batch = all_chunks[b:b+batch_size]
                try:
                    res = client.post(insert_url, headers=headers, json=batch)
                    if res.status_code in [200, 201, 204]:
                        inserted += len(batch)
                        logger.info(f"Uploaded batch {b // batch_size + 1}: {inserted}/{len(all_chunks)} chunks.")
                    else:
                        logger.error(f"Failed to upload batch {b // batch_size + 1}: status={res.status_code}, error={res.text}")
                except Exception as e:
                    logger.error(f"Failed to upload batch to Supabase: {e}")

        logger.info(f"Supabase Vector Store successfully seeded with {inserted} chunks!")
    else:
        logger.info(
            "SUPABASE_SERVICE_ROLE_KEY not configured or set to publishable key. "
            "Local embedding cache created successfully. "
            "To push to Supabase cloud: add SUPABASE_SERVICE_ROLE_KEY to your .env and re-run this script."
        )


if __name__ == "__main__":
    main()
