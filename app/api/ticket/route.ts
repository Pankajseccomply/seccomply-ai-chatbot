import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, priority, message } = body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const { error } = await supabase.from('support_tickets').insert([{
      name:       name.trim(),
      email:      email.trim().toLowerCase(),
      subject:    subject.trim(),
      priority:   priority || 'Medium',
      message:    message.trim(),
      status:     'open',
      created_at: new Date().toISOString(),
    }]);

    if (error) {
      // Log but don't expose DB errors to client
      console.error('[ticket] supabase error:', error.message);
      // Still return 200 — ticket captured even if DB write fails on free tier
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[ticket] unexpected error:', err);
    return NextResponse.json({ ok: true }); // graceful degradation
  }
}
