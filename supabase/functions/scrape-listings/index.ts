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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    console.log('Using mock data instead of Rentcast API')
    
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Mock listings data
    const listings = [
      {
        title: "5 Acre Land in Dallas",
        price: 250000,
        acres: 5,
        address: "123 Main St, Dallas, TX 75201",
        realtor_url: "https://example.com/listing1",
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        price_per_acre: 50000,
        avg_area_price_per_acre: 45000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_fetched_at: new Date().toISOString()
      },
      {
        title: "2.5 Acre Land in Fort Worth",
        price: 175000,
        acres: 2.5,
        address: "456 Oak St, Fort Worth, TX 76102",
        realtor_url: "https://example.com/listing2",
        image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        price_per_acre: 70000,
        avg_area_price_per_acre: 65000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_fetched_at: new Date().toISOString()
      }
    ]

    console.log('Mock listings:', listings)

    // Instead of clearing all listings, we'll update existing ones and add new ones
    for (const listing of listings) {
      const { data: existingListing } = await supabase
        .from('land_listings')
        .select('id')
        .eq('address', listing.address)
        .single()

      if (existingListing) {
        const { error: updateError } = await supabase
          .from('land_listings')
          .update(listing)
          .eq('id', existingListing.id)

        if (updateError) {
          console.error('Error updating listing:', updateError)
        }
      } else {
        const { error: insertError } = await supabase
          .from('land_listings')
          .insert(listing)

        if (insertError) {
          console.error('Error inserting listing:', insertError)
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${listings.length} mock listings processed successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})