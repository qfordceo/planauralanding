import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { modelData } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Prepare the system message for clash detection
    const systemMessage = `You are an expert BIM coordinator specializing in clash detection. 
    Analyze the provided building model data for potential clashes between MEP and structural elements. 
    Focus on identifying conflicts between:
    1. Mechanical ducts vs structural beams
    2. Plumbing pipes vs structural columns
    3. Electrical conduits vs structural elements
    Provide specific locations and suggested resolutions.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          { 
            role: 'user', 
            content: `Analyze this building model data for MEP and structural clashes: ${JSON.stringify(modelData)}`
          }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    
    // Store the clash detection results in Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: clashReport, error } = await supabaseClient
      .from('clash_detection_reports')
      .insert({
        model_data: modelData,
        analysis_results: data.choices[0].message.content,
        status: 'pending_review'
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: clashReport 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in clash detection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});