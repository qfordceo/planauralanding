import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filters } = await req.json()
    console.log('Received filters:', filters)
    
    // Use a more reliable floor plans website
    const baseUrl = 'https://www.americanhomestore.net/floor-plans/dallas-fort-worth'
    console.log('Attempting to fetch URL:', baseUrl)
    
    const response = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch with status:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text()
    console.log('Successfully fetched HTML content, length:', html.length)
    
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
    )
  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to fetch floor plans: ${error.message}`
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})