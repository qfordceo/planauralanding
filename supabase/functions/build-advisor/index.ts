import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    const analysis = await analyzeBuilding(buildEstimate, floorPlan, landListing)

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
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

async function analyzeBuilding(buildEstimate: any, floorPlan: any, landListing: any) {
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
    
    Provide a concise analysis of:
    1. Cost efficiency compared to target
    2. Potential cost saving opportunities
    3. Risk factors
    4. Timeline implications
    
    Keep the response under 250 words and focus on actionable insights.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a construction cost analysis expert.' },
        { role: 'user', content: prompt }
      ],
    }),
  })

  const data = await response.json()
  return data.choices[0].message.content
}