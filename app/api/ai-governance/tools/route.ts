import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export const runtime = 'nodejs';

// GET — list all tools
export async function GET() {
  const { data, error } = await supabase
    .from('ai_tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tools: data });
}

// POST — add a new tool
export async function POST(req: Request) {
  const body = await req.json();
  const { name, domain, icon = '🤖', approved = false, risk_level = 'medium', category = 'general' } = body;

  if (!name || !domain) {
    return NextResponse.json({ error: 'name and domain are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('ai_tools')
    .insert([{ name, domain: domain.toLowerCase().trim(), icon, approved, risk_level, category }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tool: data });
}

// PATCH — update tool (approve/reject/risk)
export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('ai_tools')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tool: data });
}

// DELETE — remove a tool
export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('ai_tools').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
