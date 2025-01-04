import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LicenseVerificationRequest {
  licenseNumber: string;
  licenseType: string;
  state: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { licenseNumber, licenseType, state } = await req.json() as LicenseVerificationRequest

    // Mock API call to TDLR/BBB - in production, replace with actual API calls
    const verificationResult = {
      isValid: true, // This would come from the actual API
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      verificationSource: 'TDLR',
      status: 'active'
    }

    // Log verification attempt
    const { error: logError } = await supabaseClient
      .from('license_verification_logs')
      .insert({
        license_number: licenseNumber,
        verification_source: verificationResult.verificationSource,
        verification_result: verificationResult,
        next_verification_date: verificationResult.expirationDate,
        status: verificationResult.status
      })

    if (logError) throw logError

    return new Response(
      JSON.stringify(verificationResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})