import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vaxxrwnfcaxvqvdhlsad.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheHhyd25mY2F4dnF2ZGhsc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNzYwMDYsImV4cCI6MjA1MDc1MjAwNn0.NiT_5z5UXLZB5VBZHW2k_p1e0HstxR2_FFyXpzuE4zc";

// Initialize the Supabase client with additional options
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});