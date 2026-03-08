import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { chunkText } from '../../../lib/embeddings';

export const runtime = 'nodejs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;

    if (!file)                       return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    if (!file.name.endsWith('.pdf')) return NextResponse.json({ success: false, error: 'Only PDF files allowed' }, { status: 400 });

    // 1. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    const pdfParse    = (await import('pdf-parse-fork')).default;
    const parsed      = await pdfParse(buffer);
    const text        = parsed.text?.trim();

    if (!text || text.length < 50) {
      return NextResponse.json({ success: false, error: 'Could not extract text from PDF. Make sure it is not a scanned image.' }, { status: 400 });
    }

    // 2. Chunk text into segments
    const chunks = chunkText(text, 600, 100);
    console.log(`PDF: ${file.name} → ${text.length} chars → ${chunks.length} chunks`);

    // 3. Clear old chunks
    await supabase.from('document_chunks').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 4. Insert new chunks (no embeddings needed — Supabase handles FTS automatically)
    const rows = chunks.map((content, i) => ({
      content,
      filename:    file.name,
      chunk_index: i,
    }));

    const { error } = await supabase.from('document_chunks').insert(rows);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success:  true,
      message:  `PDF processed! ${chunks.length} chunks stored and indexed for search.`,
      filename: file.name,
      chunks:   chunks.length,
    });

  } catch (err: any) {
    console.error('PDF UPLOAD ERROR:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
