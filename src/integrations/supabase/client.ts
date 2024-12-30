import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxxrwnfcaxvqvdhlsad.supabase.co';
const supabaseAnonKey = 'PASTE_YOUR_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});