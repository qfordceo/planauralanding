import { createClient } from '@supabase/supabase-js';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

interface RateLimitData {
  requests: number;
  windowStart: number;
}

export async function rateLimit(userId: string, action: string) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const key = `rate_limit:${userId}:${action}`;
  
  // Get current rate limit data
  const { data: rateLimitData } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('key', key)
    .single();

  const now = Date.now();
  let currentData: RateLimitData = rateLimitData?.data || {
    requests: 0,
    windowStart: now,
  };

  // Reset window if expired
  if (now - currentData.windowStart > RATE_LIMIT_WINDOW) {
    currentData = {
      requests: 0,
      windowStart: now,
    };
  }

  // Check if limit exceeded
  if (currentData.requests >= MAX_REQUESTS) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  // Update rate limit data
  currentData.requests++;

  // Store updated data
  await supabase
    .from('rate_limits')
    .upsert({
      key,
      data: currentData,
      updated_at: new Date().toISOString(),
    });

  return true;
}