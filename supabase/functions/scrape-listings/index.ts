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
    const rentcastApiKey = Deno.env.get('RENTCAST_API_KEY')
    
    if (!rentcastApiKey) {
      console.error('RENTCAST_API_KEY is not set')
      throw new Error('RENTCAST_API_KEY is not set')
    }

    console.log('Starting Rentcast API data fetch...')
    
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    // Updated Rentcast API endpoint with better parameters
    const baseUrl = 'https://api.rentcast.io/v1/properties'
    
    // Focused on DFW area with better filtering
    const params = {
      latitude: '32.7767',
      longitude: '-96.7970',
      propertyType: 'LAND',
      status: 'ACTIVE',
      daysOld: '90',
      limit: '50',
      offset: '0',
      radius: '20',
      minLotSize: '5000', // Minimum lot size in sq ft
      sortBy: 'PRICE',
      sortOrder: 'ASC'
    }
    
    const url = new URL(baseUrl)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    console.log('Making request to Rentcast API:', {
      url: url.toString(),
      method: 'GET'
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
        body: errorText
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
          error: 'No properties found in this area' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform properties data with improved calculations
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
        avg_area_price_per_acre: null, // We'll calculate this in a separate query
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_fetched_at: new Date().toISOString()
      }
    })

    console.log('Transformed listings:', listings)

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
        message: `${listings.length} listings processed successfully`
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