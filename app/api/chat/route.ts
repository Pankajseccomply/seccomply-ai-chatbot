import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(req: Request) {
  try {
    const { messages, session_id, language = 'English' } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'GROQ_API_KEY not set' }, { status: 500 });

    const { data: kb } = await supabase.from('company_knowledge').select('content,filename').order('created_at', { ascending: false }).limit(1);
    const knowledge = kb?.[0]?.content || null;

    const SYSTEM = knowledge
      ? `You are the SecComply AI assistant. ONLY answer using the company information below. If the answer is not there, say "I don't have that information, please contact our team. https://seccomply.net/contact. Do you have any other questions?".
--- COMPANY KNOWLEDGE (${kb?.[0]?.filename}) ---
${knowledge.slice(0, 12000)}
--- END ---
LANGUAGE: Always reply in ${language} only.`
      : `You are the SecComply AI assistant for a GRC compliance platform. Be helpful and professional. Always reply in ${language} only.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'system', content: SYSTEM }, ...messages], max_tokens: 500, temperature: 0.7 }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ success: false, error: data.error?.message }, { status: response.status });
    const reply = data.choices?.[0]?.message?.content || 'Sorry, no response.';
    return NextResponse.json({ success: true, reply, session_id: session_id || crypto.randomUUID() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}