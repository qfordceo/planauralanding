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
    const baseUrl = 'https://api.rentcast.io/v1/properties/search'
    
    // Create URL with encoded parameters
    const url = new URL(baseUrl)
    const params = {
      lat: '32.7767',
      lng: '-96.7970',
      propertyType: 'land',
      status: 'active',
      daysOld: '90',
      limit: '50',
      offset: '0'
    }
    
    // Add parameters to URL
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    console.log('Making request to Rentcast API:', {
      url: url.toString(),
      method: 'GET',
      headers: {
        'X-Api-Key': rentcastApiKey,
      }
    })

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': rentcastApiKey,
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Rentcast API error details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
        url: url.toString()
      })
      throw new Error(`Rentcast API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log(`Fetched ${data.properties?.length || 0} properties from Rentcast`)

    if (!data.properties || data.properties.length === 0) {
      console.log('No properties returned from Rentcast API')
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No properties found' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform properties data to match our schema
    const listings = data.properties.map((property: any) => {
      const acres = property.lotSize ? property.lotSize / 43560 : null // Convert sq ft to acres
      const pricePerAcre = acres && property.price ? property.price / acres : null

      return {
        title: property.description || `${acres ? Math.round(acres * 100) / 100 : 'Unknown'} Acre Land in ${property.city}`,
        price: property.price,
        acres: acres ? Math.round(acres * 100) / 100 : null,
        address: `${property.address || ''}, ${property.city}, ${property.state} ${property.zipcode}`.trim(),
        realtor_url: property.listingUrl || null,
        image_url: property.photos?.[0] || null,
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