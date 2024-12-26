import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filters } = await req.json()
    
    // Construct the URL with filters
    const baseUrl = 'https://www.floorplans.com/house-plans/';
    const queryParams = new URLSearchParams({
      foundation: 'slab',
      region: 'dallas-fort-worth',
      ...(filters.bedrooms && { bedrooms: filters.bedrooms }),
      ...(filters.priceRange && { price: filters.priceRange }),
      ...(filters.squareFootage && { sqft: filters.squareFootage }),
      ...(filters.style && { style: filters.style })
    });
    
    const url = `${baseUrl}?${queryParams.toString()}`;
    
    // Fetch the webpage content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch floor plans: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: { html } 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error scraping floor plans:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});