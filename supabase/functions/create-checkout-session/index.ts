
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
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured')
    }

    console.log('Using Stripe key starting with:', stripeKey.substring(0, 8))

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      typescript: true
    })

    const { priceId, mode, quantity } = await req.json()
    
    if (!priceId || !mode) {
      throw new Error('Missing required parameters')
    }

    // First validate the price exists
    const price = await stripe.prices.retrieve(priceId)
    if (!price) {
      throw new Error('Invalid price ID')
    }

    console.log('Creating checkout session with:', { mode, priceId, price: price.id })
    
    const session = await stripe.checkout.sessions.create({
      mode: mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      allow_promotion_codes: true,
    })

    console.log('Created session:', session.id)

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
