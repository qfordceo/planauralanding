import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Simulate some sample data for testing
    const sampleListings = [
      {
        title: "Beautiful Land Plot in Dallas",
        price: 250000,
        acres: 2.5,
        address: "123 Sample St, Dallas, TX",
        realtor_url: "https://www.realtor.com/sample1",
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        updated_at: new Date().toISOString()
      },
      {
        title: "Prime Location Land",
        price: 350000,
        acres: 3.8,
        address: "456 Test Ave, Dallas, TX",
        realtor_url: "https://www.realtor.com/sample2",
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        updated_at: new Date().toISOString()
      }
    ]

    // Insert sample listings
    const { data: listings, error } = await supabase
      .from('land_listings')
      .upsert(sampleListings, { onConflict: 'realtor_url' })
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, message: "Sample listings added successfully", listings }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})