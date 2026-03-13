import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export const runtime = 'nodejs';

// ─────────────────────────────────────────────────────────────
// MODEL FALLBACK CHAIN  (primary → fallback)
// llama-3.3-70b-versatile  → higher free-tier TPM, smarter
// llama-3.1-8b-instant     → fastest, lower TPM
// ─────────────────────────────────────────────────────────────
const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

// ─────────────────────────────────────────────────────────────
// COMPACT KNOWLEDGE BASE  (~600 tokens)
// ─────────────────────────────────────────────────────────────
const KB = `
SecComply — AI compliance automation platform
Website: https://seccomply.net | Phone: +91 9860013381
Book: https://outlook.office.com/book/SecComplyMeeting1@seccomply.net

STATS: 8x faster audits · 90% less manual work · 50+ frameworks · 100+ integrations

FRAMEWORKS: SOC 2, ISO 27001, HIPAA, GDPR, PCI DSS, NIST, CSA STAR, DPDPA, CCPA, FedRAMP, SOX, ISO 42001, ISO 27701 + more. Controls mapped ONCE, reused across frameworks.

PLATFORM FEATURES:
• AI Risk Assessment — ML risk scoring, impact heatmaps, dependency mapping
• Smart Evidence Collection — AI agents auto-gather & validate from 100+ integrations
• Anomaly Detection — real-time compliance drift detection
• Automated Control Testing — 24/7 continuous control validation
• Policy Automation — auto-generate, version, distribute security policies
• Audit Management — full lifecycle: scoping → evidence → auditor portal
• Vendor Risk Management — AI third-party risk scoring
• Trust Center — white-label compliance portal with AI questionnaire auto-fill
• Compliance Dashboard — real-time scores, gaps, evidence status

SERVICES: ISO 27001 consulting, SOC 2 readiness, HIPAA risk assessment, GDPR support, DPDP Act compliance, VAPT, Cloud security (AWS/Azure/GCP), Security policy writing, Compliance-as-a-Service, Internal audit, CISO-as-a-Service

TEAM:
• Shivani Tikadia — CEO & Founder (ex-PwC, 10+ yrs, 100+ orgs, 50+ Fortune 500)
• Vandana Pawar — GRC Lead (ISO 27001 Lead Auditor, GDPR/HIPAA specialist)
• Shyam V — Advisory (ex-BYJU'S/Myntra/PropertyGuru)

PROOF: "SOC 2 from 12 weeks → 10 days" · "AI found compliance gaps we didn't know existed" · Multi-framework (SOC 2 + ISO 27001 + HIPAA) managed simultaneously with shared controls.

FREE: DPDP Act readiness assessment at seccomply.net

PRODUCTS (details coming soon — connect users to team for any queries):
• Mission Control — SecComply platform. For details, pricing & demo: contact the SecComply team.
• Overwatch — SecComply platform. For details, pricing & demo: contact the SecComply team.
Contact: +91 9860013381 | seccomply.net/contact | Book: https://outlook.office.com/book/SecComplyMeeting1@seccomply.net
`;

// ─────────────────────────────────────────────────────────────
// GROQ API CALL  with per-model retry on rate limit
// ─────────────────────────────────────────────────────────────
async function callGroq(
  apiKey: string,
  systemPrompt: string,
  messages: any[],
  modelIndex = 0
): Promise<any> {
  const model = MODELS[modelIndex];

  const res  = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens:  350,
      temperature: 0.65,
    }),
  });

  const data = await res.json();

  if (res.ok) return data;

  const code = data?.error?.code;

  // Model decommissioned → try next model
  if (code === 'model_decommissioned' || data?.error?.message?.includes('decommissioned')) {
    if (modelIndex + 1 < MODELS.length) {
      console.warn(`Model ${model} decommissioned, trying ${MODELS[modelIndex + 1]}`);
      return callGroq(apiKey, systemPrompt, messages, modelIndex + 1);
    }
  }

  // Rate limited → wait then try next model (or same if last)
  if (code === 'rate_limit_exceeded') {
    const match = data.error.message?.match(/try again in (\d+(?:\.\d+)?)s/);
    const wait  = match ? Math.ceil(parseFloat(match[1]) * 1000) + 300 : 3000;

    if (modelIndex + 1 < MODELS.length) {
      console.warn(`Rate limit on ${model}, switching to ${MODELS[modelIndex + 1]}`);
      // Small wait then try fallback model
      await new Promise(r => setTimeout(r, Math.min(wait, 1500)));
      return callGroq(apiKey, systemPrompt, messages, modelIndex + 1);
    }
    // No more fallbacks — wait and retry same model once
    console.warn(`Rate limit on ${model}, waiting ${wait}ms then retrying`);
    await new Promise(r => setTimeout(r, wait));
    const retry = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: 350, temperature: 0.65,
      }),
    });
    const retryData = await retry.json();
    if (retry.ok) return retryData;
    throw new Error(retryData?.error?.message || `Groq error ${retry.status}`);
  }

  throw new Error(data?.error?.message || `Groq HTTP ${res.status}`);
}

// ─────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Declare session_id at top scope so catch block can access it
  let session_id = '';

  try {
    const body = await req.json();
    const { messages, language = 'English' } = body;
    session_id = body.session_id || crypto.randomUUID();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY not set' }, { status: 500 });
    }

    // ── RAG: Supabase FTS (top 3 chunks, max 1200 chars) ─────
    let ragCtx = '';
    try {
      const q = messages.at(-1)?.content || '';
      const { data: chunks, error } = await supabase.rpc('search_chunks', {
        query_text: q, match_count: 3,
      });
      if (!error && chunks?.length > 0) {
        ragCtx = chunks.map((c: any) => c.content).join('\n\n').slice(0, 1200);
      }
    } catch (e: any) {
      console.warn('RAG skipped:', e.message);
    }

    const knowledgeSrc = ragCtx
      ? `UPLOADED DOC:\n${ragCtx}\n\nKB:\n${KB}`
      : KB;

    // ── Trim history to last 6 messages ──────────────────────
    const history = messages.slice(-6);

    // ── Compact system prompt (~380 tokens) ──────────────────
    const SYSTEM = `You are Veri — SecComply's AI compliance guide. "Veri" = verify + verity (truth). Speak like a warm, knowledgeable friend: confident, empathetic, occasionally witty. Never robotic.

KNOWLEDGE:
${knowledgeSrc}

RULES:
1. Answer ANY question; tie back to SecComply naturally.
1a. If the user asks about **Mission Control** or **Overwatch**: acknowledge these are SecComply platforms, then say the team will give them all the details — share contact (+91 9860013381) and booking link. Do NOT guess or invent features.
2. Compliance topics: explain simply → connect to SecComply specifically.
3. Business pain points: empathy first → SecComply as obvious solution.
4. Persuasion (natural, never pushy): social proof, value reframe, soft CTA when right.
5. NEVER say "Certainly!", "Absolutely!", "Great question!" — just answer.
6. 70–120 words. Human voice. Short sentences. **Bold** 1–2 key facts only.
7. NEVER use em-dashes (—), en-dashes (–), arrows (→ ←), bullet symbols (•), or any special Unicode characters in your reply. Use plain periods, commas, and line breaks only.

━━━ CONFIDENCE & ESCALATION ━━━
Before answering, assess: is the answer FULLY available in the knowledge base above?

- If YES (confident) → answer normally.
- If PARTIALLY available → answer what you know, then add: "For the full picture, our team can walk you through the specifics — reach us at +91 9860013381 or seccomply.net/contact"
- If NOT in KB at all → do NOT guess or make up details. Instead say something like: "That's a great specific question — it's best answered by our experts directly. You can reach the SecComply team at **+91 9860013381** or [seccomply.net/contact](https://seccomply.net/contact). They'll give you an exact answer within hours."

━━━ OUTPUT FORMAT ━━━
Your ENTIRE response must be ONLY this raw JSON object. First character { last character }. No text outside it. No markdown fences:
{"answer":"your reply","suggestions":["chip 1","chip 2"],"confident":true}

━━━ SUGGESTIONS RULES ━━━
- Exactly 2 suggestions
- MUST be directly related to what the user just asked — not generic openers
- Example: user asks about SOC 2 → suggest "SOC 2 Type II difference?" and "How long does SOC 2 take?"
- Example: user asks about pricing → suggest "Book a free consultation" and "What's included in CaaS?"
- Phrased as what the USER would type next (not bot-voice like "Would you like...")
- 4–7 words each
- Only suggest topics that exist in the KB
- Never repeat a suggestion already shown in this conversation
Reply entirely in: ${language}.`;

    // ── Call Groq with model fallback ─────────────────────────
    const data = await callGroq(apiKey, SYSTEM, history);
    const raw  = data.choices?.[0]?.message?.content || '';

    // ── Parse JSON response ───────────────────────────────────
    // Model sometimes prepends text before JSON, or adds }} at end.
    // Strategy: find first '{', then try every '}' from the right.
    let reply       = '';
    let suggestions: string[] = [];
    let confident   = true;
    try {
      const clean = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const start  = clean.indexOf('{');

      if (start !== -1) {
        // Try progressively shorter endings until JSON.parse succeeds
        let parsed: any = null;
        let pos = clean.length - 1;
        while (pos > start) {
          if (clean[pos] === '}') {
            try {
              parsed = JSON.parse(clean.slice(start, pos + 1));
              break; // success
            } catch { /* keep trimming */ }
          }
          pos--;
        }
        if (parsed) {
          reply       = (parsed.answer || '').trim();
          suggestions = Array.isArray(parsed.suggestions)
            ? parsed.suggestions.filter((s: any) => typeof s === 'string' && s.length > 2).slice(0, 2)
            : [];
          confident   = parsed.confident !== false; // default true if missing
        }
      }

      // Final fallback: strip any JSON blob from raw text and show plain text
      if (!reply) {
        reply = clean.replace(/\{[\s\S]*\}/, '').trim() || "I'm having a moment — please try again!";
      }
    } catch {
      // Strip JSON from raw and show just the text portion
      reply = raw.replace(/\{[\s\S]*\}/, '').trim() || "I'm having a moment — please try again!";
    }

    // ── Log to Supabase (fire and forget) ────────────────────
    supabase.from('chat_logs').insert([
      { session_id, role: 'user',      content: messages.at(-1)?.content || '' },
      { session_id, role: 'assistant', content: reply },
    ]).then(() => {}).catch(() => {});

    return NextResponse.json({ success: true, reply, suggestions, confident, session_id });

  } catch (err: any) {
    console.error('CHAT ERROR:', err.message);
    // Return a graceful fallback — never show a raw error to the user
    return NextResponse.json({
      success:    true,
      reply:      "I'm getting a lot of questions right now 🙏 Give me just a second and send that again — I promise I'll have a good answer!",
      suggestions: ['Book a consultation', 'SecComply services?'],
      session_id,
    });
  }
}
