import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxxrwnfcaxvqvdhlsad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheHhyd25mY2F4dnF2ZGhsc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzYwMDYsImV4cCI6MjA1MDc1MjAwNn0.NiT_5z5UXLZB5VBZHW2k_p1e0HstxR2_FFyXpzuE4zc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});