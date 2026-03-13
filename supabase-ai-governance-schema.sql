-- ═══════════════════════════════════════════════════════════
-- SecComply AI Governance — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- ── 1. AI Tools registry ──────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_tools (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  domain      text NOT NULL UNIQUE,
  icon        text DEFAULT '🤖',
  approved    boolean DEFAULT false,
  risk_level  text DEFAULT 'medium' CHECK (risk_level IN ('low','medium','high')),
  category    text DEFAULT 'general',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ── 2. Activity logs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_activity_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email  text NOT NULL,
  tool_name   text NOT NULL,
  tool_domain text,
  action      text NOT NULL,
  risk_level  text DEFAULT 'low' CHECK (risk_level IN ('low','medium','high')),
  detail      text,
  source      text DEFAULT 'manual',   -- 'manual' | 'extension' | 'api' | 'network'
  created_at  timestamptz DEFAULT now()
);

-- ── 3. Alerts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  severity    text NOT NULL CHECK (severity IN ('critical','high','medium','low')),
  title       text NOT NULL,
  description text,
  user_email  text,
  tool_name   text,
  status      text DEFAULT 'open' CHECK (status IN ('open','investigating','dismissed','resolved')),
  created_at  timestamptz DEFAULT now()
);

-- ── 4. Shadow AI detections ───────────────────────────────
CREATE TABLE IF NOT EXISTS shadow_ai (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name   text NOT NULL,
  domain      text NOT NULL,
  user_count  int DEFAULT 1,
  last_seen   timestamptz DEFAULT now(),
  created_at  timestamptz DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_logs_created   ON ai_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_risk      ON ai_activity_logs(risk_level);
CREATE INDEX IF NOT EXISTS idx_alerts_status  ON ai_alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_sev     ON ai_alerts(severity);

-- ── Seed data — AI tools ──────────────────────────────────
INSERT INTO ai_tools (name, domain, icon, approved, risk_level, category) VALUES
  ('ChatGPT',       'chat.openai.com',    '🤖', false, 'high',   'llm'),
  ('GitHub Copilot','copilot.github.com', '👾', true,  'medium', 'coding'),
  ('Notion AI',     'notion.so',          '📝', true,  'low',    'productivity'),
  ('Claude',        'claude.ai',          '✦',  false, 'medium', 'llm'),
  ('Google Gemini', 'gemini.google.com',  '💫', true,  'medium', 'llm'),
  ('Midjourney',    'midjourney.com',     '🎨', false, 'high',   'image'),
  ('Copy.ai',       'copy.ai',            '✍️', false, 'high',   'writing')
ON CONFLICT (domain) DO NOTHING;

-- ── Seed data — Activity logs ─────────────────────────────
INSERT INTO ai_activity_logs (user_email, tool_name, tool_domain, action, risk_level, detail, source) VALUES
  ('john.smith@acme.com',  'ChatGPT',        'chat.openai.com',    'Prompt submitted',   'high',   'AWS access key detected in prompt',           'extension'),
  ('priya.k@acme.com',     'GitHub Copilot', 'copilot.github.com', 'Code completion',    'low',    'Normal code completion activity',             'api'),
  ('mark.t@acme.com',      'ChatGPT',        'chat.openai.com',    'File uploaded',      'high',   'Customer PII data uploaded (32 records)',      'extension'),
  ('sarah.m@acme.com',     'Notion AI',      'notion.so',          'Document generated', 'low',    'Internal meeting notes processed',            'api'),
  ('james.l@acme.com',     'Midjourney',     'midjourney.com',     'Image generated',    'medium', 'Unauthorized tool accessed from corporate device','network'),
  ('anjali.r@acme.com',    'Claude',         'claude.ai',          'Prompt submitted',   'medium', 'Source code shared with external AI',         'extension'),
  ('tom.w@acme.com',       'ChatGPT',        'chat.openai.com',    'API key shared',     'high',   'GitHub token found in conversation',          'extension'),
  ('nina.p@acme.com',      'Google Gemini',  'gemini.google.com',  'Prompt submitted',   'low',    'General productivity query',                  'api');

-- ── Seed data — Alerts ────────────────────────────────────
INSERT INTO ai_alerts (severity, title, description, user_email, tool_name, status) VALUES
  ('critical', 'AWS Access Key Exposed',     'john.smith uploaded AWS credentials to ChatGPT',    'john.smith@acme.com', 'ChatGPT',   'open'),
  ('critical', 'Customer PII Data Uploaded', '32 customer records sent to external AI service',   'mark.t@acme.com',     'ChatGPT',   'open'),
  ('high',     'Source Code Shared',         'Internal repository code shared with Claude.ai',    'anjali.r@acme.com',   'Claude',    'investigating'),
  ('high',     'GitHub Token Detected',      'Authentication token found in ChatGPT conversation','tom.w@acme.com',      'ChatGPT',   'open'),
  ('medium',   'Shadow AI Tool Detected',    'Midjourney accessed from corporate network',        'james.l@acme.com',    'Midjourney','open'),
  ('medium',   'Unapproved Tool: Copy.ai',   '2 employees accessing unauthorized AI writing tool','multiple@acme.com',   'Copy.ai',   'open');

-- ── Seed data — Shadow AI ─────────────────────────────────
INSERT INTO shadow_ai (tool_name, domain, user_count) VALUES
  ('Midjourney',  'midjourney.com',   3),
  ('Copy.ai',     'copy.ai',          2),
  ('Perplexity',  'perplexity.ai',    1),
  ('Runway ML',   'runwayml.com',     1)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- RAG (Retrieval Augmented Generation) — Document chunks
-- ═══════════════════════════════════════════════════════════

-- 1. Drop old tables if they exist
DROP TABLE IF EXISTS document_chunks;
DROP TABLE IF EXISTS company_knowledge;

-- 2. Create chunked document table with full-text search
CREATE TABLE document_chunks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content     text NOT NULL,
  filename    text NOT NULL,
  chunk_index int  NOT NULL,
  fts         tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  created_at  timestamptz DEFAULT now()
);

-- 3. Full-text search index
CREATE INDEX document_chunks_fts_idx ON document_chunks USING gin(fts);

-- 4. Search function — called from /api/chat
CREATE OR REPLACE FUNCTION search_chunks(
  query_text  text,
  match_count int DEFAULT 5
)
RETURNS TABLE (content text, rank real)
LANGUAGE sql STABLE
AS $$
  SELECT
    content,
    ts_rank(fts, websearch_to_tsquery('english', query_text)) AS rank
  FROM document_chunks
  WHERE fts @@ websearch_to_tsquery('english', query_text)
  ORDER BY rank DESC
  LIMIT match_count;
$$;
