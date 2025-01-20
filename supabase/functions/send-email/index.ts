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
    const { type, recipientId, subject, html, contractId, contractorId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get recipient email
    const { data: recipient, error: recipientError } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', recipientId)
      .single()

    if (recipientError) throw recipientError

    // Log notification
    if (type === 'contract') {
      await supabaseClient
        .from('contract_signing_notifications')
        .insert({
          contract_id: contractId,
          recipient_id: recipientId,
          notification_type: 'email',
          email_status: 'sent'
        })
    } else if (type === 'contractor') {
      await supabaseClient
        .from('contractor_notifications')
        .insert({
          contractor_id: contractorId,
          type: 'email',
          status: 'sent',
          metadata: { subject, sent_at: new Date() }
        })
    }

    // Here you would integrate with your email service provider
    // For example, using Resend, SendGrid, etc.
    console.log(`Email would be sent to ${recipient.email} with subject: ${subject}`)

    return new Response(
      JSON.stringify({ success: true }),
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
