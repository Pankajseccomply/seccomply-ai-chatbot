import { NextResponse } from 'next/server';
import supabase from '../../../../lib/supabase';

export async function GET(_: Request, { params }: { params: { id:string } }) {
  const { data, error } = await supabase.from('questions').select('*').eq('id', params.id).single();
  if (error || !data) return NextResponse.json({ success:false, error:'Not found' }, { status:404 });
  return NextResponse.json({ success:true, data });
}

export async function PUT(req: Request, { params }: { params: { id:string } }) {
  const body = await req.json();
  const updates: Record<string,any> = {};
  if (body.label      !== undefined) updates.label      = body.label.trim();
  if (body.message    !== undefined) updates.message    = body.message.trim();
  if (body.category   !== undefined) updates.category   = body.category;
  if (body.active     !== undefined) updates.active     = Boolean(body.active);
  if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);
  const { data, error } = await supabase.from('questions').update(updates).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ success:false, error:error.message }, { status:500 });
  return NextResponse.json({ success:true, data });
}

export async function DELETE(_: Request, { params }: { params: { id:string } }) {
  const { error } = await supabase.from('questions').delete().eq('id', params.id);
  if (error) return NextResponse.json({ success:false, error:error.message }, { status:500 });
  return NextResponse.json({ success:true, message:'Deleted.' });
}
