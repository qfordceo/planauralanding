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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found')
    }

    const prompt = `Analyze this building project and provide insights:
    Floor Plan: ${floorPlan.square_feet} sq ft, ${floorPlan.bedrooms} beds, ${floorPlan.bathrooms} baths
    Land Cost: $${buildEstimate.land_cost}
    Target Build Cost: $${buildEstimate.target_build_cost}
    Current Estimated Cost: $${buildEstimate.total_estimated_cost}
    Current Actual Cost: $${buildEstimate.total_actual_cost}
    
    Provide a detailed analysis of:
    1. Cost efficiency compared to target
    2. Potential cost saving opportunities
    3. Risk factors and mitigation strategies
    4. Timeline implications and recommendations
    5. Material selection optimization
    6. Labor cost management
    7. Quality vs cost trade-offs
    
    Focus on actionable insights and specific recommendations. Include numerical comparisons where relevant.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a construction cost analysis expert with deep knowledge of building economics, material costs, and project management.' },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    return new Response(
      JSON.stringify({ analysis: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})