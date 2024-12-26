import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filters } = await req.json()
    console.log('Received filters:', filters)
    
    // Using a different reliable source for DFW floor plans
    const baseUrl = 'https://www.americanhomestore.net/dfw-floor-plans'
    console.log('Attempting to fetch URL:', baseUrl)
    
    // Try up to 3 times with different User-Agent strings
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
    ]

    let response = null;
    let error = null;

    for (const userAgent of userAgents) {
      try {
        console.log('Attempting fetch with User-Agent:', userAgent)
        
        response = await fetch(baseUrl, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0',
            'Referer': 'https://www.google.com/'
          }
        })

        console.log('Response status:', response.status)
        
        if (response.ok) {
          break;
        }

        // Wait before trying again
        await sleep(1000);
      } catch (e) {
        error = e;
        console.error('Fetch attempt failed:', e);
        await sleep(1000);
      }
    }

    if (!response?.ok) {
      throw new Error(`Failed to fetch after multiple attempts. Last status: ${response?.status || 'unknown'}. ${error?.message || ''}`)
    }
    
    const html = await response.text()
    console.log('Successfully fetched HTML content, length:', html.length)
    console.log('Sample of content:', html.substring(0, 200))
    
    if (html.length < 100) {
      throw new Error('Received suspiciously short HTML content')
    }
    
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
        error: `Failed to fetch floor plans: ${error.message}`,
        details: error.stack
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