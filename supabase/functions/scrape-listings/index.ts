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
      throw new Error('RENTCAST_API_KEY is not set')
    }
    
    const supabase = createClient(supabaseUrl!, supabaseKey!)

    console.log('Starting Rentcast API data fetch...')

    // Fetch properties from Rentcast API
    const response = await fetch('https://api.rentcast.io/v1/properties/search', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': rentcastApiKey
      },
      body: JSON.stringify({
        "latitude": 32.7767,  // Dallas latitude
        "longitude": -96.7970, // Dallas longitude
        "propertyType": ["LAND"],
        "status": ["FOR_SALE", "RECENTLY_SOLD"],  // Include recently sold properties for comps
        "radius": 50, // 50 mile radius
        "limit": 50  // Increased limit to get more comps
      })
    });

    if (!response.ok) {
      throw new Error(`Rentcast API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.properties?.length || 0} properties from Rentcast`);

    // Separate active listings and sold properties
    const activeListings = data.properties?.filter((p: any) => p.status === "FOR_SALE") || [];
    const soldProperties = data.properties?.filter((p: any) => p.status === "RECENTLY_SOLD") || [];

    // Calculate average price per acre for the area
    const calculatePricePerAcre = (property: any) => {
      if (!property.squareFootage || !property.price) return null;
      const acres = property.squareFootage / 43560;
      return property.price / acres;
    };

    const validSoldPrices = soldProperties
      .map(calculatePricePerAcre)
      .filter((price: number | null): price is number => price !== null);

    const avgPricePerAcre = validSoldPrices.length > 0
      ? validSoldPrices.reduce((a: number, b: number) => a + b, 0) / validSoldPrices.length
      : null;

    console.log(`Average price per acre in the area: $${avgPricePerAcre?.toFixed(2)}`);

    // Transform active listings data to match our schema
    const listings = activeListings.map((property: any) => {
      const acres = property.squareFootage ? property.squareFootage / 43560 : null;
      const pricePerAcre = acres ? property.price / acres : null;

      return {
        title: `${acres ? Math.round(acres) : 'Unknown'} Acre Land in ${property.city}`,
        price: property.price,
        acres: acres ? Math.round(acres * 100) / 100 : null,
        address: `${property.streetAddress}, ${property.city}, ${property.state} ${property.zipCode}`,
        realtor_url: property.listingUrl || null,
        image_url: property.photoUrls?.[0] || null,
        price_per_acre: pricePerAcre ? Math.round(pricePerAcre) : null,
        avg_area_price_per_acre: avgPricePerAcre ? Math.round(avgPricePerAcre) : null,
        updated_at: new Date().toISOString()
      };
    });

    // Clear existing listings and insert new ones
    const { error: deleteError } = await supabase
      .from('land_listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error('Error deleting existing listings:', deleteError);
      throw deleteError;
    }

    // Insert new listings
    const { data: insertedListings, error: insertError } = await supabase
      .from('land_listings')
      .insert(listings)
      .select();

    if (insertError) {
      console.error('Error inserting listings:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${listings.length} listings processed successfully`, 
        listings: insertedListings 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even on error since we're handling it gracefully
      }
    )
  }
})