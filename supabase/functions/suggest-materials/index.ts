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
    const { floorPlan } = await req.json()

    const messages = [
      {
        role: "system",
        content: "You are an AI construction materials expert that provides detailed breakdowns of all materials needed for home construction. Include quantities, units, and estimated costs based on current market rates. Organize materials by category and provide specific details about each item."
      },
      {
        role: "user",
        content: `Generate a comprehensive materials list for this home:
          - ${floorPlan.bedrooms} bedrooms
          - ${floorPlan.bathrooms} bathrooms
          - ${floorPlan.square_feet} square feet
          - Style: ${floorPlan.style || 'Modern'}
          - Foundation: ${floorPlan.foundation_type}
          
          Include all materials needed from foundation to finish, excluding only major contractor-supplied items like concrete. Break down by category with quantities and current market price estimates.`
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    // Process the AI response into structured data
    // This is a simplified example - the actual AI response would need proper parsing
    const categories = [
      {
        name: "Interior Finishes",
        estimatedCost: 15000,
        items: [
          {
            name: "Interior Paint",
            description: "Premium low-VOC paint for walls and ceilings",
            estimatedCost: 2500,
            unit: "gallons",
            quantity: 25,
            category: "Interior Finishes"
          },
          // ... more items
        ]
      },
      {
        name: "Flooring",
        estimatedCost: 22000,
        items: [
          {
            name: "Hardwood Flooring",
            description: "Solid oak hardwood planks",
            estimatedCost: 12000,
            unit: "square feet",
            quantity: 1000,
            category: "Flooring"
          },
          // ... more items
        ]
      },
      // ... more categories
    ];

    return new Response(
      JSON.stringify({ categories }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in suggest-materials function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
});