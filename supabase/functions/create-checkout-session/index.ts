
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch Stripe secret key from database
    const { data: secretData, error: secretError } = await supabaseClient
      .from('stripe_secrets')
      .select('value')
      .eq('key', 'secret_key')
      .single()

    if (secretError) {
      console.error('Database error:', secretError)
      throw new Error('Failed to fetch Stripe secret key from database')
    }

    if (!secretData || !secretData.value) {
      console.error('No secret key found in database')
      throw new Error('Stripe secret key not configured')
    }

    // Log key format details without exposing the key
    const keyValue = secretData.value.trim()
    console.log('Key format check:', {
      length: keyValue.length,
      prefix: keyValue.substring(0, 7),
      hasWhitespace: /\s/.test(keyValue)
    })

    const stripe = new Stripe(keyValue, {
      apiVersion: '2023-10-16',
    })

    const { priceId, mode, quantity } = await req.json()
    
    if (!priceId || !mode) {
      throw new Error('Missing required parameters')
    }

    console.log('Creating checkout session with:', { priceId, mode, quantity })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: quantity || 1,
        },
      ],
      mode: mode, // 'subscription' or 'payment'
      success_url: `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      allow_promotion_codes: true,
    })

    console.log('Successfully created Stripe session:', session.id)

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in create-checkout-session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
