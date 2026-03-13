import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export const runtime = 'nodejs';

// GET — list logs with optional filter
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const risk   = searchParams.get('risk');
  const limit  = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('ai_activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (risk && risk !== 'all') query = query.eq('risk_level', risk);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data });
}

// POST — submit a new activity log (from browser extension, API, or manual)
export async function POST(req: Request) {
  const body = await req.json();
  const { user_email, tool_name, tool_domain, action, risk_level = 'low', detail, source = 'manual' } = body;

  if (!user_email || !tool_name || !action) {
    return NextResponse.json({ error: 'user_email, tool_name and action are required' }, { status: 400 });
  }

  // Auto-detect risk if not provided
  const HIGH_RISK_KEYWORDS = ['api key','access key','password','token','secret','pii','ssn','credit card','confidential','private key'];
  const detectedRisk = HIGH_RISK_KEYWORDS.some(k => (detail||'').toLowerCase().includes(k))
    ? 'high'
    : risk_level;

  // Auto-create alert if high risk
  const { data: log, error } = await supabase
    .from('ai_activity_logs')
    .insert([{ user_email, tool_name, tool_domain, action, risk_level: detectedRisk, detail, source }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-generate alert for high/critical risk
  if (detectedRisk === 'high') {
    await supabase.from('ai_alerts').insert([{
      severity:    'high',
      title:       `Sensitive data detected in ${tool_name}`,
      description: detail || `${user_email} submitted a high-risk prompt to ${tool_name}`,
      user_email,
      tool_name,
      status:      'open',
    }]);
  }

  // Auto-add to shadow AI if tool is not approved
  const { data: knownTool } = await supabase
    .from('ai_tools')
    .select('approved')
    .eq('domain', tool_domain || '')
    .single();

  if (!knownTool || !knownTool.approved) {
    await supabase.rpc('upsert_shadow_ai', { p_tool_name: tool_name, p_domain: tool_domain || '' })
      .catch(() => {}); // ignore if RPC doesn't exist yet
  }

  return NextResponse.json({ log });
}
