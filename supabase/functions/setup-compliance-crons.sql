-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule document renewal checks to run daily
SELECT cron.schedule(
  'check-document-renewals-daily',
  '0 8 * * *', -- Run at 8 AM every day
  $$
  SELECT net.http_post(
    url:='https://vaxxrwnfcaxvqvdhlsad.functions.supabase.co/check-document-renewals',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);

-- Schedule annual compliance reviews to run weekly
SELECT cron.schedule(
  'annual-compliance-review-weekly',
  '0 9 * * 1', -- Run at 9 AM every Monday
  $$
  SELECT net.http_post(
    url:='https://vaxxrwnfcaxvqvdhlsad.functions.supabase.co/annual-compliance-review',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body:='{}'::jsonb
  ) AS request_id;
  $$
);