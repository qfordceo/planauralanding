import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get material and supplier info from request
    const { material_id, supplier_id } = await req.json()

    // Get supplier API details
    const { data: supplier } = await supabase
      .from('material_suppliers')
      .select('api_endpoint, api_credentials')
      .eq('id', supplier_id)
      .single()

    if (!supplier?.api_endpoint) {
      throw new Error('Supplier API configuration not found')
    }

    // Fetch real-time price from supplier API
    // This is a mock implementation - replace with actual API call
    const mockPrice = Math.random() * 100 + 50
    
    // Update price in database
    const { error: updateError } = await supabase
      .from('material_price_updates')
      .upsert({
        material_id,
        supplier_id,
        price: mockPrice,
        unit: 'unit',
        last_updated: new Date().toISOString(),
        next_update: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ price: mockPrice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})