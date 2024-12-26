import FirecrawlApp from '@mendable/firecrawl-js';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawl = new FirecrawlApp({ 
      apiKey: Deno.env.get('FIRECRAWL_API_KEY') 
    });

    // URLs to scrape - add more as needed
    const urls = [
      'https://www.realtor.com/realestateandhomes-search/Dallas_TX/type-land',
    ];

    console.log('Starting scrape job...');

    for (const url of urls) {
      const result = await firecrawl.crawlUrl(url, {
        limit: 10,
        scrapeOptions: {
          selectors: {
            title: '.card-title',
            price: '.price',
            acres: '.acres',
            address: '.address',
            image: 'img.property-image@src',
            link: 'a.property-link@href'
          }
        }
      });

      if (result.success) {
        console.log(`Successfully scraped ${url}`);
        
        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Process and store the results
        const { data: scrapedData } = result;
        if (Array.isArray(scrapedData)) {
          for (const listing of scrapedData) {
            const { data, error } = await supabase
              .from('land_listings')
              .upsert({
                title: listing.title,
                price: parseFloat(listing.price?.replace(/[^0-9.]/g, '') || '0'),
                acres: parseFloat(listing.acres?.replace(/[^0-9.]/g, '') || '0'),
                address: listing.address,
                realtor_url: listing.link,
                image_url: listing.image,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'realtor_url'
              });

            if (error) {
              console.error('Error storing listing:', error);
            }
          }
        }
      } else {
        console.error(`Failed to scrape ${url}:`, result.error);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in scrape job:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});