import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxxrwnfcaxvqvdhlsad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheHhyd25mY2F4dnF2ZGhsc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQyMjE4ODAsImV4cCI6MjAxOTc5Nzg4MH0.xZFWz3E8GXlGMxA_nG8GX_7o_Ea_Q_0uhW_qHZZfA0c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});