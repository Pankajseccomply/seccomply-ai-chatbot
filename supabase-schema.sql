-- Run this ONCE in Supabase → SQL Editor → New Query → Run
-- Then your database is ready!

CREATE TABLE IF NOT EXISTS questions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  message    TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'general',
  active     BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 99,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Starter questions (shown as chips in the chatbot)
INSERT INTO questions (label, message, category, sort_order) VALUES
  ('What is SecComply?',  'What is SecComply and what does it do?',             'general',    1),
  ('SOC 2 automation',    'How does SecComply automate SOC 2 compliance?',       'frameworks', 2),
  ('Pricing & plans',     'What are the pricing plans for SecComply?',           'sales',      3),
  ('Book a demo',         'I would like to book a demo of SecComply.',           'sales',      4),
  ('HIPAA compliance',    'Can SecComply help with HIPAA compliance?',           'frameworks', 5),
  ('Integrations',        'What integrations does SecComply support?',           'technical',  6),
  ('ISO 27001',           'How does SecComply support ISO 27001 certification?', 'frameworks', 7),
  ('Free trial',          'Is there a free trial available for SecComply?',      'sales',      8);
