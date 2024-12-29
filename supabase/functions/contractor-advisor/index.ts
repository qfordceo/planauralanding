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
    const { 
      section,
      data
    } = await req.json()

    const messages = [
      {
        role: "system",
        content: "You are an AI advisor for contractors, providing expert guidance on various aspects of construction business management. Be specific, practical, and focus on actionable insights."
      },
      {
        role: "user",
        content: generatePrompt(section, data)
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

    const result = await response.json();
    
    return new Response(
      JSON.stringify({
        analysis: result.choices[0].message.content,
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

function generatePrompt(section: string, data: any): string {
  switch (section) {
    case 'inventory':
      return `Analyze this contractor's inventory data and provide insights:
        Current Inventory: ${JSON.stringify(data.inventory)}
        Recent Orders: ${JSON.stringify(data.orders)}
        
        Please provide:
        1. Inventory optimization suggestions
        2. Reorder recommendations
        3. Cost-saving opportunities`;
    
    case 'workforce':
      return `Review this contractor's workforce data and provide insights:
        Workers: ${JSON.stringify(data.workers)}
        Tasks: ${JSON.stringify(data.tasks)}
        Time Tracking: ${JSON.stringify(data.timeTracking)}
        
        Please provide:
        1. Resource allocation recommendations
        2. Productivity improvement suggestions
        3. Training recommendations`;
    
    case 'projects':
      return `Analyze this contractor's project data and provide insights:
        Current Projects: ${JSON.stringify(data.projects)}
        Performance Metrics: ${JSON.stringify(data.metrics)}
        
        Please provide:
        1. Project optimization suggestions
        2. Risk identification
        3. Performance improvement recommendations`;
    
    case 'finances':
      return `Review this contractor's financial data and provide insights:
        Revenue: ${JSON.stringify(data.revenue)}
        Expenses: ${JSON.stringify(data.expenses)}
        Outstanding Payments: ${JSON.stringify(data.payments)}
        
        Please provide:
        1. Cash flow optimization suggestions
        2. Cost reduction opportunities
        3. Revenue growth recommendations`;
    
    default:
      return `Provide general business insights for this contractor based on:
        ${JSON.stringify(data)}`;
  }
}