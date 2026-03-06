import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export const runtime = 'nodejs'; // needed for pdf-parse

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;

    if (!file) return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    if (!file.name.endsWith('.pdf')) return NextResponse.json({ success: false, error: 'Only PDF files allowed' }, { status: 400 });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfParse = (await import('pdf-parse-fork')).default;
    const parsed = await pdfParse(buffer);
    const text = parsed.text?.trim();

    if (!text || text.length < 50) {
      return NextResponse.json({ success: false, error: 'Could not extract text from PDF. Make sure it is not a scanned image.' }, { status: 400 });
    }

    // Delete old knowledge and save new
    await supabase.from('company_knowledge').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabase.from('company_knowledge').insert([{ content: text, filename: file.name }]);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, message: `PDF uploaded successfully. Extracted ${text.length} characters.`, filename: file.name });

  } catch (err: any) {
    console.error('PDF UPLOAD ERROR:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
