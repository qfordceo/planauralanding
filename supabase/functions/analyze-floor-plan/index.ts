import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { 
  calculateDimensions, 
  extractFeatures, 
  calculateMaterialEstimates 
} from '../../../src/utils/floor-plan-analysis.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl, customizations } = await req.json();
    
    const endpoint = Deno.env.get('AZURE_CV_ENDPOINT');
    const apiKey = Deno.env.get('AZURE_CV_KEY');

    if (!endpoint || !apiKey) {
      throw new Error('Azure CV credentials not configured');
    }

    // 1. Analyze floor plan with Azure Computer Vision
    const analysisUrl = `${endpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,text,tags`;
    const response = await fetch(analysisUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey,
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`Azure CV API error: ${response.statusText}`);
    }

    const azureResult = await response.json();
    console.log('Azure CV Analysis Result:', azureResult);

    // 2. Extract room dimensions and features
    const rooms = azureResult.objects
      ?.filter((obj: any) => obj.tags?.includes('room'))
      .map((obj: any) => {
        const dimensions = calculateDimensions(obj.boundingBox);
        return {
          type: obj.tags[0] || 'room',
          dimensions,
          area: dimensions.width * dimensions.length,
          features: extractFeatures(obj, azureResult.text)
        };
      }) || [];

    // 3. Detect electrical layout
    const electricalElements = azureResult.objects
      ?.filter((obj: any) => 
        obj.tags?.some((tag: string) => 
          ['outlet', 'switch', 'light_fixture'].includes(tag)
        )
      )
      .map((obj: any) => ({
        type: obj.tags.find((tag: string) => 
          ['outlet', 'switch', 'light_fixture'].includes(tag)
        ),
        position: {
          x: obj.boundingBox[0],
          y: obj.boundingBox[1]
        }
      })) || [];

    // 4. Prepare analysis result
    const result = {
      rooms,
      totalArea: rooms.reduce((total: number, room: any) => total + room.area, 0),
      electricalLayout: {
        elements: electricalElements
      },
      materialEstimates: calculateMaterialEstimates(rooms, customizations)
    };

    // 5. Store analysis in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('ai_floor_plan_analyses')
      .insert({
        analysis_data: azureResult,
        room_dimensions: { rooms },
        electrical_layout: { elements: electricalElements },
        material_suggestions: result.materialEstimates
      });

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error analyzing floor plan:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});