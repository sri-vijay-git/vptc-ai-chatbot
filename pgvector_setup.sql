-- 1. Enable the pgvector extension to work with AI embedding vectors
create extension if not exists vector;

-- 2. Create a table to track uploaded knowledge base documents
create table if not exists public.vptc_documents (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create a table to store the actual text chunks and their AI embeddings
-- We use vector(384) because the 'all-MiniLM-L6-v2' AI model creates 384-dimensional vectors
create table if not exists public.vptc_embeddings (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.vptc_documents(id) on delete cascade,
  content text not null,
  embedding vector(384)
);

-- 4. Create a specialized Postgres function for the AI Chatbot to perform Semantic Search
create or replace function match_vptc_embeddings (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language sql stable
as $$
  select
    vptc_embeddings.id,
    vptc_embeddings.document_id,
    vptc_embeddings.content,
    1 - (vptc_embeddings.embedding <=> query_embedding) as similarity
  from vptc_embeddings
  where 1 - (vptc_embeddings.embedding <=> query_embedding) > match_threshold
  order by vptc_embeddings.embedding <=> query_embedding
  limit match_count;
$$;
