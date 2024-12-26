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

    // Make request to Firecrawl API
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY')
    const response = await fetch('https://api.firecrawl.co/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url: 'https://www.realtor.com/realestateandhomes-search/Dallas_TX/type-land',
        limit: 10,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        },
      }),
    })

    const data = await response.json()
    console.log('Firecrawl response:', data)

    // Process and store the listings
    if (data.success) {
      const { data: listings, error } = await supabase
        .from('land_listings')
        .upsert(
          data.results.map((result: any) => ({
            title: result.title,
            price: parseFloat(result.price?.replace(/[^0-9.]/g, '')),
            acres: parseFloat(result.acres?.replace(/[^0-9.]/g, '')),
            address: result.address,
            realtor_url: result.url,
            image_url: result.image_url,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'realtor_url' }
        )

      if (error) throw error
      return new Response(JSON.stringify({ success: true, listings }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Failed to scrape listings')
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})