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

    const analysisUrl = `${endpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,text`;
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

    const result = {
      rooms,
      totalArea: rooms.reduce((total: number, room: any) => total + room.area, 0),
      materialEstimates: calculateMaterialEstimates(rooms, customizations)
    };

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('floor_plan_analyses')
      .insert({
        analysis_data: azureResult,
        material_estimates: result.materialEstimates,
        customizations
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