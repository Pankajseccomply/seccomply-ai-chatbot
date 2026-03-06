import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let query = supabase.from('questions').select('*').order('sort_order').order('created_at');
  if (searchParams.get('category')) query = query.eq('category', searchParams.get('category')!);
  if (searchParams.get('active'))   query = query.eq('active', searchParams.get('active') === 'true');
  const { data, error } = await query;
  if (error) return NextResponse.json({ success:false, error:error.message }, { status:500 });
  return NextResponse.json({ success:true, data });
}

export async function POST(req: Request) {
  const { label, message, category='general', sort_order=99 } = await req.json();
  if (!label?.trim() || !message?.trim())
    return NextResponse.json({ success:false, error:'label and message are required' }, { status:400 });
  const { data, error } = await supabase.from('questions')
    .insert([{ label:label.trim(), message:message.trim(), category, sort_order:Number(sort_order), active:true }])
    .select().single();
  if (error) return NextResponse.json({ success:false, error:error.message }, { status:500 });
  return NextResponse.json({ success:true, data }, { status:201 });
}
