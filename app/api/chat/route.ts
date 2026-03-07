import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const { messages, session_id, language = 'English', msg_count = 0 } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'GROQ_API_KEY not set' }, { status: 500 });

    const { data: kb } = await supabase
      .from('company_knowledge')
      .select('content, filename')
      .order('created_at', { ascending: false })
      .limit(1);

    const knowledge = kb?.[0]?.content || null;

    const SYSTEM = `You are the SecComply AI assistant — a warm, knowledgeable compliance advisor.

${knowledge
  ? `KNOWLEDGE RULES:
- For SecComply-specific questions (pricing, features, plans, demos, team, integrations) → answer ONLY from the company document below.
- For general compliance questions (SOC 2, HIPAA, ISO 27001, GDPR etc.) → use your expertise.
- If a SecComply question is not in the document → say "I don't have that specific detail — please reach out to our team at hello@seccomply.io"

--- COMPANY KNOWLEDGE BASE (${kb?.[0]?.filename}) ---
${knowledge.slice(0, 10000)}
--- END ---`
  : `About SecComply: GRC automation platform. Supports SOC 2, ISO 27001, HIPAA, GDPR, PCI DSS, NIST and 50+ frameworks. AI-powered evidence collection, 300+ integrations (AWS, GitHub, Okta, Slack, Jira). Plans from $299/mo. 14-day free trial.`}

CRITICAL — You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code fences.
Exactly this structure:
{"answer":"your reply here","suggestions":["suggestion 1","suggestion 2"]}

ANSWER RULES:
- Under 140 words, warm and conversational
- Only ask a follow-up question if it genuinely fits — do NOT force questions
- Let the user lead

SUGGESTIONS RULES:
- Exactly 2 short suggestions (under 6 words each)
- Directly relevant to what the user just asked
- Never repeat topics already discussed
- In ${language} language

LANGUAGE: Reply entirely in ${language}.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
        // No response_format — not reliably supported by this model
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return NextResponse.json({ success: false, error: data.error?.message || 'API error' }, { status: response.status });
    }

    const raw = data.choices?.[0]?.message?.content || '';

    // Robustly extract JSON — handles cases where model wraps in ```json fences
    let reply       = '';
    let suggestions: string[] = [];

    try {
      // Strip markdown fences if present
      const cleaned = raw
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .trim();

      // Find JSON object boundaries
      const start = cleaned.indexOf('{');
      const end   = cleaned.lastIndexOf('}');

      if (start !== -1 && end !== -1 && end > start) {
        const jsonStr = cleaned.slice(start, end + 1);
        const parsed  = JSON.parse(jsonStr);
        reply       = parsed.answer      || raw;
        suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 2) : [];
      } else {
        // Model didn't return JSON — use raw text as the reply
        reply = raw;
      }
    } catch {
      // JSON parse failed — use raw text
      reply = raw || 'Sorry, something went wrong. Please try again.';
    }

    // Log to Supabase async (non-blocking)
    const sid = session_id || crypto.randomUUID();
    supabase.from('chat_logs').insert([
      { session_id: sid, role: 'user',      content: messages.at(-1)?.content || '' },
      { session_id: sid, role: 'assistant', content: reply },
    ]).then(() => {}).catch(() => {});

    return NextResponse.json({ success: true, reply, suggestions, session_id: sid });

  } catch (err: any) {
    console.error('CHAT ERROR:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
