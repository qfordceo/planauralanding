import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vaxxrwnfcaxvqvdhlsad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheHhyd25mY2F4dnF2ZGhsc2FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQwMDc2MzIsImV4cCI6MjAxOTU4MzYzMn0.HSMjBM8_RNWqVHZ_qQz6ynUGGwYEjuAQvXDiCZhqcpY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});