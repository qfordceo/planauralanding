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

    // Get all documents expiring in the next 30 days
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: expiringDocs, error: docsError } = await supabaseClient
      .from('contractor_compliance_documents')
      .select(`
        *,
        contractors (
          user_id,
          business_name,
          notification_preferences
        )
      `)
      .lte('expiration_date', thirtyDaysFromNow)
      .gt('expiration_date', new Date().toISOString())
      .eq('verification_status', 'verified')

    if (docsError) throw docsError

    // Process each expiring document
    for (const doc of expiringDocs || []) {
      const daysUntilExpiry = Math.ceil(
        (new Date(doc.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      // Send notification via the existing contractor-email function
      await supabaseClient.functions.invoke('send-contractor-email', {
        body: {
          contractorId: doc.contractor_id,
          subject: `Document Expiring Soon: ${doc.document_type}`,
          html: `
            <p>Your ${doc.document_type} will expire in ${daysUntilExpiry} days.</p>
            <p>Please ensure to renew it before expiration to maintain compliance.</p>
          `,
          type: 'compliance'
        }
      })

      // Log the notification
      await supabaseClient
        .from('compliance_verification_logs')
        .insert({
          contractor_id: doc.contractor_id,
          verification_type: 'document_expiration',
          verification_status: 'pending_renewal',
          verification_data: {
            document_type: doc.document_type,
            days_until_expiry: daysUntilExpiry,
            notification_sent: true
          }
        })
    }

    return new Response(
      JSON.stringify({ success: true, processed: expiringDocs?.length || 0 }),
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