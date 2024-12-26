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
    const rentcastApiKey = Deno.env.get('RENTCAST_API_KEY')
    
    if (!rentcastApiKey) {
      console.error('RENTCAST_API_KEY is not set')
      throw new Error('RENTCAST_API_KEY is not set')
    }

    console.log('Starting Rentcast API data fetch...')
    
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Fetch properties from Rentcast API
    const apiUrl = 'https://api.rentcast.io/v2/listings/search'
    const params = new URLSearchParams({
      latitude: '32.7767',  // Dallas latitude
      longitude: '-96.7970', // Dallas longitude
      propertyType: 'LAND',
      status: 'FOR_SALE',
      radius: '50', // 50 mile radius
      limit: '50',
      sortBy: 'created',
      sortOrder: 'desc'
    })

    console.log('Making request to Rentcast API:', {
      url: `${apiUrl}?${params.toString()}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${rentcastApiKey}`,
      }
    })

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${rentcastApiKey}`,
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Rentcast API error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      })
      throw new Error(`Rentcast API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log(`Fetched ${data.listings?.length || 0} listings from Rentcast`)

    if (!data.listings || data.listings.length === 0) {
      console.log('No listings returned from Rentcast API')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No listings found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform properties data to match our schema
    const listings = data.listings.map((listing: any) => {
      const acres = listing.lotSize ? listing.lotSize / 43560 : null // Convert sq ft to acres
      const pricePerAcre = acres && listing.price ? listing.price / acres : null

      return {
        title: listing.description || `${acres ? Math.round(acres * 100) / 100 : 'Unknown'} Acre Land in ${listing.city}`,
        price: listing.price,
        acres: acres ? Math.round(acres * 100) / 100 : null,
        address: `${listing.address || ''}, ${listing.city}, ${listing.state} ${listing.zipcode}`.trim(),
        realtor_url: listing.listingUrl || null,
        image_url: listing.photos?.[0] || null,
        price_per_acre: pricePerAcre ? Math.round(pricePerAcre) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_fetched_at: new Date().toISOString()
      }
    })

    console.log('Transformed listings:', listings)

    // Clear existing listings and insert new ones
    const { error: deleteError } = await supabase
      .from('land_listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      console.error('Error deleting existing listings:', deleteError)
      throw deleteError
    }

    // Insert new listings
    const { data: insertedListings, error: insertError } = await supabase
      .from('land_listings')
      .insert(listings)
      .select()

    if (insertError) {
      console.error('Error inserting listings:', insertError)
      throw insertError
    }

    console.log(`Successfully inserted ${insertedListings.length} listings`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${listings.length} listings processed successfully`, 
        listings: insertedListings 
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