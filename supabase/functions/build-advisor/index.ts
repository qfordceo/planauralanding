import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { buildEstimate, floorPlan, landListing } = await req.json()

    const messages = [
      {
        role: "system",
        content: "You are an expert build advisor helping clients understand their home build estimates and providing actionable recommendations. Be concise and focus on cost-saving opportunities and important considerations."
      },
      {
        role: "user",
        content: `Please analyze this build estimate and provide insights:
          Floor Plan: ${floorPlan.name} (${floorPlan.square_feet} sq ft)
          Land: ${landListing.address} (${landListing.acres} acres)
          Target Build Cost: $${buildEstimate.target_build_cost}
          Current Total: $${buildEstimate.total_cost}
          Comparable Home Value: $${buildEstimate.comp_average_price}
          
          Line Items:
          ${buildEstimate.build_line_items.map(item => 
            `- ${item.category}: $${item.estimated_cost} (${item.description})`
          ).join('\n')}`
      }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    const data = await response.json()
    const analysis = data.choices[0].message.content

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in build-advisor function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})