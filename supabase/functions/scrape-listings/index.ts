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

    console.log('Starting real estate data generation...')

    // Generate realistic sample data
    const generateListings = () => {
      const locations = [
        "North Dallas",
        "Richardson",
        "Plano",
        "Frisco",
        "McKinney",
        "Allen",
        "Prosper",
        "Celina"
      ];

      const streetTypes = ["Road", "Lane", "Drive", "Street", "Avenue", "Boulevard"];
      const descriptions = [
        "Prime Development Land",
        "Beautiful Wooded Lot",
        "Commercial Land Opportunity",
        "Residential Building Plot",
        "Investment Property",
        "Mixed-Use Development Site",
        "Agricultural Land",
        "Ranch Property"
      ];

      const imageIds = [
        "1500382017468",
        "1449844425380",
        "1449844496123",
        "1449844562487",
        "1449844654789",
        "1449844721456",
        "1449844823789",
        "1449844912345"
      ];

      return Array.from({ length: 8 }, (_, i) => {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const streetNum = Math.floor(Math.random() * 9000) + 1000;
        const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        const acres = (Math.random() * 5 + 0.5).toFixed(2);
        const pricePerAcre = Math.floor(Math.random() * 100000) + 100000;
        const price = Math.floor(Number(acres) * pricePerAcre);

        return {
          title: `${description} in ${location}`,
          price: price,
          acres: Number(acres),
          address: `${streetNum} ${location} ${streetType}, Dallas, TX`,
          realtor_url: `https://www.realtor.com/realestateandhomes-search/Dallas_TX/type-land`,
          image_url: `https://images.unsplash.com/photo-${imageIds[i]}-9049fed747ef`,
          updated_at: new Date().toISOString()
        };
      });
    };

    const listings = generateListings();
    console.log(`Generated ${listings.length} listings`);

    // Clear existing listings and insert new ones
    const { error: deleteError } = await supabase
      .from('land_listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

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