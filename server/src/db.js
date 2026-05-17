import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.warn(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for database access.'
  );
}

export const supabase = createClient(url || '', key || '', {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

export const BUCKET = 'product-images';
