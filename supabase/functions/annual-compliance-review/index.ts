import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get contractors who haven't had a compliance review in the last year
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: contractors, error: contractorsError } = await supabaseClient
      .from('contractors')
      .select('*')
      .or(`
        last_compliance_review.is.null,
        last_compliance_review.lt.${oneYearAgo}
      `)

    if (contractorsError) throw contractorsError

    // Process each contractor
    for (const contractor of contractors || []) {
      // Create compliance review record
      await supabaseClient
        .from('compliance_verification_logs')
        .insert({
          contractor_id: contractor.id,
          verification_type: 'annual_review',
          verification_status: 'pending',
          verification_data: {
            review_type: 'annual',
            notification_sent: true,
            previous_review: contractor.last_compliance_review
          }
        })

      // Send notification
      await supabaseClient.functions.invoke('send-contractor-email', {
        body: {
          contractorId: contractor.id,
          subject: 'Annual Compliance Review Required',
          html: `
            <p>It's time for your annual compliance review.</p>
            <p>Please log in to your account to confirm your information is up to date.</p>
          `,
          type: 'compliance'
        }
      })
    }

    return new Response(
      JSON.stringify({ success: true, processed: contractors?.length || 0 }),
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