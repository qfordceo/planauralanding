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
          content: `You are a BIM clash detection expert. Analyze the provided model data to identify potential clashes between MEP and structural elements. 
          Focus on:
          1. Intersections between pipes and walls/floors
          2. HVAC ducts crossing structural beams
          3. Electrical conduits conflicting with plumbing
          4. Spatial clearance violations
          Return a structured analysis with specific locations and severity levels.`
        },
        {
          role: "user",
          content: `Analyze this BIM model data for potential clashes, focusing on MEP and structural intersections. 
          Return a detailed JSON response with clash locations and severity levels: ${JSON.stringify(modelData)}`
        }
      ],
      temperature: 0.2, // Lower temperature for more focused, analytical responses
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
        status: 'pending_review',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing clash report:', error)
      throw error
    }

    console.log('Clash detection completed:', { reportId: report.id })

    return new Response(
      JSON.stringify({ 
        success: true, 
        report,
        analysis 
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