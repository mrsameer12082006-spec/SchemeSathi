-- =====================================================================
-- SchemeSathi: Supabase pgvector Migration & Security Hardening
-- =====================================================================
-- CRITICAL SECURITY RULE:
-- NO PUBLIC READ ACCESS to embeddings.
-- Frontend communicates strictly with FastAPI backend.
-- Backend communicates with Supabase using SUPABASE_SERVICE_ROLE_KEY.
-- =====================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create scheme_embeddings table
CREATE TABLE IF NOT EXISTS public.scheme_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_code TEXT NOT NULL,
    scheme_name_en TEXT NOT NULL,
    scheme_name_hi TEXT NOT NULL,
    category TEXT NOT NULL,
    chunk_title TEXT NOT NULL,
    chunk_type TEXT NOT NULL, -- 'overview', 'eligibility', 'benefits', 'documents', 'steps'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding vector(384),    -- 384 dimensions (all-MiniLM-L6-v2 / bge-small)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create HNSW index for ultra-fast cosine similarity search
CREATE INDEX IF NOT EXISTS scheme_embeddings_hnsw_idx 
ON public.scheme_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.scheme_embeddings ENABLE ROW LEVEL SECURITY;

-- 5. Revoke ALL privileges from anon and public roles (Zero Public Scraping)
REVOKE ALL ON TABLE public.scheme_embeddings FROM anon, public;

-- 6. Grant full access strictly to service_role (Used only by FastAPI backend)
DROP POLICY IF EXISTS "Strict service_role access only to scheme_embeddings" ON public.scheme_embeddings;
CREATE POLICY "Strict service_role access only to scheme_embeddings"
ON public.scheme_embeddings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 7. Secure Vector Similarity Search Stored Procedure (Security Definier)
CREATE OR REPLACE FUNCTION match_scheme_embeddings (
    query_embedding vector(384),
    match_threshold float DEFAULT 0.35,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    scheme_code TEXT,
    scheme_name_en TEXT,
    scheme_name_hi TEXT,
    category TEXT,
    chunk_title TEXT,
    chunk_type TEXT,
    content TEXT,
    metadata JSONB,
    similarity float
)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
    SELECT
        se.id,
        se.scheme_code,
        se.scheme_name_en,
        se.scheme_name_hi,
        se.category,
        se.chunk_title,
        se.chunk_type,
        se.content,
        se.metadata,
        1 - (se.embedding <=> query_embedding) AS similarity
    FROM public.scheme_embeddings se
    WHERE 1 - (se.embedding <=> query_embedding) > match_threshold
    ORDER BY se.embedding <=> query_embedding
    LIMIT match_count;
$$;
