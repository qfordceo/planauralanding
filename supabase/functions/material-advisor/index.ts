import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { preferences, budget, sustainability } = await req.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in sustainable building materials and construction.'
          },
          {
            role: 'user',
            content: `Suggest alternative materials based on these preferences:
              Budget: ${budget}
              Sustainability Preferences: ${JSON.stringify(sustainability)}
              Current Preferences: ${JSON.stringify(preferences)}
              
              Format the response as a JSON array of objects with properties:
              - material_name
              - description
              - sustainability_score (1-100)
              - cost_impact (percentage difference)
              - benefits (array of strings)
              `
          }
        ],
      }),
    })

    const data = await response.json()
    const suggestions = JSON.parse(data.choices[0].message.content)

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in material-advisor:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})