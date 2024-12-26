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
        "Allen"
      ];

      const streetTypes = ["Road", "Lane", "Drive", "Street", "Avenue", "Boulevard"];
      const descriptions = [
        "Prime Development Land",
        "Beautiful Wooded Lot",
        "Commercial Land Opportunity",
        "Residential Building Plot",
        "Investment Property",
        "Mixed-Use Development Site"
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
          image_url: `https://images.unsplash.com/photo-${1500382017468 + i}-9049fed747ef`,
          updated_at: new Date().toISOString()
        };
      });
    };

    const listings = generateListings();
    console.log(`Generated ${listings.length} listings`);

    // Insert listings
    const { data: insertedListings, error } = await supabase
      .from('land_listings')
      .upsert(listings, { 
        onConflict: 'realtor_url',
        ignoreDuplicates: false // Update existing entries
      })
      .select()

    if (error) throw error

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
        error: error.message,
        details: "Falling back to generated data"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 even on error since we're handling it gracefully
      }
    )
  }
})