# SchemeSathi AI Voice Agent: Architecture & Integration Manual 🇮🇳🎙️

> **Production Guide for Multimodal Indian Language Voice Integration with Groq Llama 3.1 8B, Sarvam AI, and Supabase pgvector.**

---

## 📌 Executive Summary

SchemeSathi (योजना साथी) is an empathetic, privacy-first civic-tech guidance platform that helps Indian citizens discover official government welfare schemes through voice in everyday Hindi, Hinglish, and English.

This guide provides the complete blueprint for the **AI Voice Agent**, covering:
1. **Accurate Indian Language Voice Pipeline** (Sarvam AI Saaras STT & Bulbul TTS)
2. **Precision Entity Extraction** (Groq `llama-3.1-8b-instant` with Pydantic schema validation & unit conversions)
3. **Legal Source of Truth** (Deterministic Rules Engine)
4. **Hardened Vector Store** (Supabase `pgvector` with strict Row-Level Security)
5. **Global Cloud Deployment** (Render / Railway / Supabase)

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Citizen Device (Mobile / Web Browser)"]
        A[Microphone Audio / Spoken Hindi or Hinglish] -->|Base64 WAV/WebM| B[Frontend Voice Hook]
        B -->|POST /api/ai/chat| C[FastAPI Gateway]
        K[Browser Audio Player / Web Speech Fallback] <--|Audio Stream / Base64| C
    end

    subgraph VoicePipeline["Voice Layer (Sarvam AI)"]
        D["Sarvam AI Saaras (STT)\n- Native Hindi & Hinglish Code-mixing\n- Indian Regional Accents"]
        E["Sarvam AI Bulbul (TTS)\n- v4-flash Natural Voice\n- Low-latency Audio Synthesis"]
    end

    subgraph LLMLayer["AI Extraction & Explanation Layer (Groq)"]
        F["Groq llama-3.1-8b-instant\n- 3-Attempt Pydantic Retry Loop\n- Converts Bigha/Acre -> Hectares\n- Converts Monthly -> Annual INR"]
        G["Conversational Explainer\n- Warm, respectful 2-3 sentence summary\n- Anti-scam & Free govt notice"]
    end

    subgraph TruthEngine["Deterministic Eligibility Engine (Single Source of Truth)"]
        H["Rules Engine (eligibility_engine.py)\n- Evaluates Land, Income, Age, Gender, Area\n- Outputs PASSED, FAILED, MISSING Rules"]
    end

    subgraph CloudDatabase["Supabase PostgreSQL Cloud (Private RLS)"]
        I[("Schemes Catalog\n40+ Top Central Schemes")]
        J[("scheme_embeddings (pgvector)\nProtected by service_role key")]
    end

    C -->|Audio Bytes| D
    D -->|Transcribed Text| F
    F -->|Validated UserProfile JSON| H
    I <-->|Fetch Criteria & Schemas| H
    H -->|EvaluationResult| G
    G -->|Conversational Text| E
    E -->|Audio Base64| C
    J <-.->|Hybrid RAG Search via Service Key| C
```

---

## ⚠️ The Cardinal Architectural Rule

> [!CAUTION]
> **DO NOT LET THE LLM DECIDE ELIGIBILITY.**
>
> The Large Language Model's job is **strictly limited to attribute extraction and conversational translation**. 
> - **LLM Role**: Translates "mere paas 3 bigha zameen hai" into `{"landholding_hectares": 0.75}`.
> - **Rules Engine Role**: Evaluates whether `0.75 <= scheme.max_landholding_hectares`.
>
> If the LLM is permitted to guess eligibility, it will hallucinate criteria, mislead vulnerable citizens, and fail academic or legal audits. The Python `EligibilityEngine` is the sole legal source of truth.

---

## 🛠️ Step-by-Step Pipeline Flow

```
1. Citizen speaks in Hindi / Hinglish:
   "मैं उत्तर प्रदेश से हूँ, मेरे पास 3 बीघा ज़मीन है और वार्षिक आय 1 लाख से कम है।"
   
2. STT (Sarvam Saaras v2):
   Transcribes with 98%+ Hinglish accuracy, preserving local terms.

3. Entity Extraction (Groq llama-3.1-8b-instant):
   Runs strict Pydantic model validation with retry loop:
   {
     "occupation": "Farmer",
     "landholding_hectares": 0.75,   <-- Converted from 3 Bigha (3 * 0.25)
     "annual_income": 75000.0,       <-- Standardized from "1 lakh se kam"
     "state": "Uttar Pradesh",
     "area": "Rural"
   }

4. Deterministic Engine Evaluation:
   Compares attributes against official scheme criteria from Supabase.
   - PM-KISAN: PASSED (Land 0.75 ha <= 2.0 ha ceiling)
   - PMFBY: PASSED (Active agricultural cultivator)
   - KCC: PASSED (Credit support within limits)

5. Conversational Explanation (Groq 8B):
   Generates warm, spoken summary:
   "आपके विवरण के अनुसार आप पीएम-किसान और फसल बीमा योजना के पात्र हैं। सरकारी आवेदन पूर्णतः निःशुल्क हैं, किसी भी बिचौलिए को कोई शुल्क न दें।"

6. TTS (Sarvam Bulbul v4-flash):
   Synthesizes spoken audio in natural Hindi voice for playback.
```

---

## 📏 Indian Unit Conversion Matrix

The Groq prompt is hardcoded with standardized Indian agricultural and wage conversions:

| Citizen Expression | Standardized Value | Conversion Factor |
| :--- | :--- | :--- |
| **1 बीघा (Bigha)** | `0.25 hectares` | 1 Bigha ≈ 0.25 ha (North India standard) |
| **1 एकड़ (Acre)** | `0.404 hectares` | 1 Acre ≈ 0.4046 ha |
| **1 कनाल (Kanal)** | `0.05 hectares` | 1 Kanal ≈ 0.05 ha (Punjab/Haryana/HP) |
| **₹10,000 प्रति माह** | `₹1,20,000 / year` | Monthly * 12 |
| **₹400 दैनिक दिहाड़ी** | `₹1,20,000 / year` | Daily * 300 work days |
| **"1 लाख से कम"** | `₹75,000` | Midpoint of < ₹1L tier |
| **"1 से 2.5 लाख"** | `₹1,80,000` | Standard EWS / Marginal tier |
| **"2.5 लाख से अधिक"** | `₹3,50,000` | Above non-taxable slab |

---

## 🔒 Security: Supabase pgvector & Service Role

To prevent unauthorized public scraping of the scheme database and embeddings:

1. **Row-Level Security (RLS) is Enabled** on `scheme_embeddings`.
2. **Zero Anonymous Access**: Public `anon` users have **REVOKED** access.
3. **Backend-Only Access**: Only the FastAPI backend connects to Supabase using `SUPABASE_SERVICE_ROLE_KEY`.

### Applying the SQL Migration
Open the Supabase SQL Editor and execute [`sql/01_pgvector_setup.sql`](file:///Users/manikchauhan/Desktop/SchemeSathi-master/sql/01_pgvector_setup.sql):

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS public.scheme_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code TEXT NOT NULL,
    scheme_name_en TEXT NOT NULL,
    scheme_name_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    chunk_title TEXT NOT NULL,
    chunk_type TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(384),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scheme_embeddings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.scheme_embeddings FROM anon, public;

DROP POLICY IF EXISTS "Strict service_role access only to scheme_embeddings" ON public.scheme_embeddings;
CREATE POLICY "Strict service_role access only to scheme_embeddings"
ON public.scheme_embeddings FOR ALL TO service_role USING (true) WITH CHECK (true);
```

### Seeding Vector Embeddings
Run the embedding populator from your terminal:
```bash
python scripts/generate_embeddings.py
```
This chunks all 40 schemes into 160 semantic segments, generates dense 384-dimensional embeddings using `all-MiniLM-L6-v2`, and uploads them securely.

---

## 📡 API Reference & Testing

### 1. Extract Profile from Natural Language
`POST /api/ai/extract`

```bash
curl -X POST "http://127.0.0.1:8000/api/ai/extract" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Main UP ka kisan hoon, 3 bigha zameen hai aur aamdani 80000 hai",
    "language": "hi"
  }'
```

**Response:**
```json
{
  "status": "success",
  "profile": {
    "occupation": "Farmer",
    "landholding_hectares": 0.75,
    "annual_income": 80000.0,
    "state": "Uttar Pradesh"
  },
  "raw_attributes": {
    "पेशा": "किसान",
    "भूमि": "3.0 बीघा (0.75 ha)",
    "वार्षिक आय": "₹80,000",
    "राज्य": "उत्तर प्रदेश"
  }
}
```

---

### 2. Full AI Conversational Turn
`POST /api/ai/chat`

```bash
curl -X POST "http://127.0.0.1:8000/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "मैं एक छोटा किसान हूँ, 1.5 हेक्टेयर ज़मीन है और आय ₹75,000 है।",
    "language": "hi",
    "synthesize_audio": true
  }'
```

**Response:**
```json
{
  "session_id": "8f2b7a9c-...",
  "transcript": "मैं एक छोटा किसान हूँ, 1.5 हेक्टेयर ज़मीन है और आय ₹75,000 है।",
  "reply": "नमस्ते! आपके विवरण के अनुसार आप प्रधानमंत्री किसान सम्मान निधि और फसल बीमा योजना के पात्र हो सकते हैं। सरकारी आवेदन पूरी तरह मुफ़्त हैं।",
  "audio_base64": "UklGRi...",
  "fallback_to_browser_tts": false,
  "eligible_count": 3,
  "needs_info_count": 1,
  "results": [
    {
      "scheme_id": "pm-kisan",
      "name": "प्रधानमंत्री किसान सम्मान निधि",
      "status": "potentially_eligible",
      "passed": ["खेती योग्य भूमि 2.0 हेक्टेयर सीमा के भीतर है", "लक्षित श्रेणी/पेशा मेल खाता है"]
    }
  ],
  "done": true
}
```

---

### 3. Semantic RAG Search Over Scheme Knowledge Base
`POST /api/ai/search`

Allows citizens or LLMs to ask direct semantic questions in Hindi or English (e.g. documents, eligibility rules, benefits):

```bash
curl -X POST "http://127.0.0.1:8000/api/ai/search" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "फसल नुकसान और प्राकृतिक आपदा पर बीमा",
    "top_k": 2
  }'
```

**Response:**
```json
{
  "status": "success",
  "query": "फसल नुकसान और प्राकृतिक आपदा पर बीमा",
  "count": 2,
  "results": [
    {
      "scheme_code": "pmfby",
      "scheme_name_en": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      "scheme_name_hi": "प्रधानमंत्री फसल बीमा योजना",
      "category": "farmers",
      "chunk_title": "Pradhan Mantri Fasal Bima Yojana (PMFBY) - Overview & Summary",
      "chunk_type": "overview",
      "similarity": 0.8241
    }
  ]
}
```

---

## 🚀 Global Cloud Deployment (Make It Globally Available)

To make your AI voice agent work globally from any mobile device (without running localhost):

### 1. Backend Deployment (Render or Railway)
1. Push your repository to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com) or [Railway.app](https://railway.app).
3. Root Directory: `schemesathi-backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Set Environment Variables in dashboard:
   - `GROQ_API_KEY`: `gsk_...`
   - `SARVAM_API_KEY`: `your_sarvam_key`
   - `SUPABASE_URL`: `https://yywtrgwhemfwywfnwmxf.supabase.co`
   - `SUPABASE_KEY`: `sb_publishable_...`
   - `SUPABASE_SERVICE_ROLE_KEY`: `eyJh...`

### 2. Frontend Deployment (Vercel)
1. Create a project on [Vercel](https://vercel.com).
2. Root Directory: `schemesathi-frontend`
3. Environment Variables:
   - `VITE_API_URL`: `https://your-deployed-backend.onrender.com`
   - `VITE_SUPABASE_URL`: `https://yywtrgwhemfwywfnwmxf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `sb_publishable_...`

When accessed from your mobile phone on 4G/5G, the client sends voice to your Render cloud backend, which queries the same Supabase cloud database, returning instant Hindi voice answers anywhere in the world!
