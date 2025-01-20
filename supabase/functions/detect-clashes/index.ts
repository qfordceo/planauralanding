import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClashDetectionRequest {
  modelData: {
    elements: Array<{
      id: string;
      type: string;
      position: { x: number; y: number; z: number };
      dimensions: { width: number; height: number; depth: number };
      category: string;
    }>;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    const { modelData } = await req.json() as ClashDetectionRequest
    console.log('Analyzing model for clashes:', { modelData })

    // Analyze the model data for clashes using OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a BIM clash detection expert. Analyze the provided model data to identify potential clashes between MEP and structural elements. Return a structured analysis with specific locations and severity levels."
        },
        {
          role: "user",
          content: `Analyze this BIM model data for potential clashes, focusing on MEP and structural intersections. Return a JSON response with clash locations and details: ${JSON.stringify(modelData)}`
        }
      ],
    })

    const analysis = completion.data.choices[0].message?.content || ''
    
    // Store the clash detection results
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: report, error } = await supabaseClient
      .from('clash_detection_reports')
      .insert({
        model_data: modelData,
        analysis_results: analysis,
        status: 'pending_review'
      })
      .select()
      .single()

    if (error) throw error

    console.log('Clash detection completed:', { reportId: report.id })

    return new Response(
      JSON.stringify({ 
        success: true, 
        report 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in clash detection:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})