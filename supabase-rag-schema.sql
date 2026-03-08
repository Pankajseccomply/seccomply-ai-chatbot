-- ─────────────────────────────────────────────────────────────────
-- Run this in Supabase SQL Editor (one time only)
-- Uses built-in PostgreSQL full-text search — NO extra API needed
-- ─────────────────────────────────────────────────────────────────

-- 1. Drop old tables if they exist
drop table if exists document_chunks;
drop table if exists company_knowledge;

-- 2. Create chunked document table with full-text search
create table document_chunks (
  id          uuid primary key default gen_random_uuid(),
  content     text not null,
  filename    text not null,
  chunk_index int  not null,
  fts         tsvector generated always as (to_tsvector('english', content)) stored,
  created_at  timestamptz default now()
);

-- 3. Create full-text search index (fast)
create index document_chunks_fts_idx on document_chunks using gin(fts);

-- 4. Search function — called from chat API
create or replace function search_chunks(
  query_text  text,
  match_count int default 5
)
returns table (content text, rank real)
language sql stable
as $$
  select
    content,
    ts_rank(fts, websearch_to_tsquery('english', query_text)) as rank
  from document_chunks
  where fts @@ websearch_to_tsquery('english', query_text)
  order by rank desc
  limit match_count;
$$;
