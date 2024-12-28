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
    const { buildEstimate, floorPlan, landListing } = await req.json()

    const messages = [
      {
        role: "system",
        content: "You are an AI build advisor that helps analyze home building projects and suggests materials and improvements. Be specific about materials needed and provide helpful insights about costs and quality considerations."
      },
      {
        role: "user",
        content: `Please analyze this home building project and provide material suggestions:
          Floor Plan: ${floorPlan.bedrooms} bedrooms, ${floorPlan.bathrooms} bathrooms, ${floorPlan.square_feet} sq ft
          Style: ${floorPlan.style || 'Not specified'}
          Foundation: ${floorPlan.foundation_type || 'Standard'}
          Land: ${landListing.acres} acres
          Target Build Cost: $${buildEstimate.target_build_cost}
          Current Estimated Cost: $${buildEstimate.total_estimated_cost}
        `
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify({
        analysis: data.choices[0].message.content,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})