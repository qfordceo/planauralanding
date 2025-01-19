import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    console.log(`Processing ${type} email with data:`, data)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let emailContent
    switch (type) {
      case 'contract':
        emailContent = {
          subject: 'Contract Update',
          body: `Contract status: ${data.status}`
        }
        break
      case 'contractor':
        emailContent = {
          subject: 'Contractor Update',
          body: `Update from contractor: ${data.message}`
        }
        break
      case 'marketing':
        emailContent = {
          subject: data.subject,
          body: data.content
        }
        break
      default:
        throw new Error('Invalid email type')
    }

    // Here you would integrate with your email service
    // For now, we'll just log it
    console.log('Sending email:', emailContent)

    return new Response(
      JSON.stringify({ 
        message: 'Email sent successfully',
        type,
        content: emailContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})