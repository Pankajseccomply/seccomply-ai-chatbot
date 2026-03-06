import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const g = global as any;
const supabase = g._supabase ?? createClient(url, key, { auth: { persistSession: false } });
if (process.env.NODE_ENV !== 'production') g._supabase = supabase;

export default supabase;
