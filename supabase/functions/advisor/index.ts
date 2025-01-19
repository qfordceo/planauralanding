import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    console.log(`Processing ${type} advice request with data:`, data)

    let advice
    switch (type) {
      case 'build':
        advice = await generateBuildAdvice(data)
        break
      case 'contractor':
        advice = await generateContractorAdvice(data)
        break
      default:
        throw new Error('Invalid advice type')
    }

    return new Response(
      JSON.stringify({ 
        message: 'Advice generated successfully',
        advice 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating advice:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

async function generateBuildAdvice(data: any) {
  // Build advice logic here
  return {
    recommendations: [],
    estimatedCosts: {},
    timeline: {}
  }
}

async function generateContractorAdvice(data: any) {
  // Contractor advice logic here
  return {
    recommendations: [],
    bestPractices: [],
    warnings: []
  }
}