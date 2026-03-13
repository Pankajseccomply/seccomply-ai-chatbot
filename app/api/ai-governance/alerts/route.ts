import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const severity = searchParams.get('severity');
  const status   = searchParams.get('status') || 'open';

  let query = supabase
    .from('ai_alerts')
    .select('*')
    .order('created_at', { ascending: false });

  if (severity && severity !== 'all') query = query.eq('severity', severity);
  if (status   && status   !== 'all') query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ alerts: data });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });

  const { data, error } = await supabase
    .from('ai_alerts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ alert: data });
}
