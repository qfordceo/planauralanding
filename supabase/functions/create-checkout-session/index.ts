
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching Stripe secret key from database...')
    const { data: secretData, error: secretError } = await supabaseClient
      .from('stripe_secrets')
      .select('value')
      .eq('key', 'secret_key')
      .single()

    if (secretError) {
      console.error('Database error:', secretError)
      throw new Error('Failed to fetch Stripe secret key')
    }

    if (!secretData?.value) {
      console.error('No secret key found in database')
      throw new Error('Stripe secret key not configured')
    }

    const stripeKey = secretData.value.trim()
    console.log('Retrieved stripe key length:', stripeKey.length)

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    })

    const { priceId, mode, quantity } = await req.json()
    
    if (!priceId || !mode) {
      throw new Error('Missing required parameters')
    }

    console.log('Creating checkout session with mode:', mode)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ],
      mode: mode,
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      allow_promotion_codes: true,
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Checkout session error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
