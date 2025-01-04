import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerificationRequest {
  documentId: string;
  documentType: string;
  documentNumber: string;
  issuingAuthority: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { documentId, documentType, documentNumber, issuingAuthority } = await req.json() as VerificationRequest;

    // Get verification provider
    const { data: provider, error: providerError } = await supabaseClient
      .from('verification_providers')
      .select('*')
      .eq('provider_type', documentType)
      .eq('is_active', true)
      .single();

    if (providerError) throw providerError;

    // Mock API call to verification provider
    const verificationResult = {
      isValid: true,
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      verificationId: crypto.randomUUID(),
      status: 'active'
    };

    // Log verification attempt
    await supabaseClient
      .from('verification_logs')
      .insert({
        document_id: documentId,
        verification_provider_id: provider.id,
        verification_status: verificationResult.isValid ? 'verified' : 'failed',
        verification_data: verificationResult
      });

    // Update document status
    await supabaseClient
      .from('contractor_compliance_documents')
      .update({
        verification_status: verificationResult.isValid ? 'verified' : 'rejected',
        last_verification_attempt: new Date().toISOString(),
        verification_provider: provider.provider_name,
        verification_response: verificationResult,
        expiration_date: verificationResult.expirationDate
      })
      .eq('id', documentId);

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