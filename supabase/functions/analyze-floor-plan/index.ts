import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { calculateDimensions, detectRoomType, extractFeatures } from './roomAnalysis.ts';
import { calculateMaterialEstimates } from './materialEstimates.ts';
import { MATERIAL_OPTIONS } from './constants.ts';
import type { AnalysisResult } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      throw new Error('No image URL provided');
    }

    console.log('Processing floor plan:', imageUrl);

    const azureEndpoint = Deno.env.get('AZURE_CV_ENDPOINT');
    const azureKey = Deno.env.get('AZURE_CV_KEY');

    if (!azureEndpoint || !azureKey) {
      throw new Error('Azure CV credentials not configured');
    }

    const azureResponse = await fetch(
      `${azureEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,tags,read&language=en&model-version=latest`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': azureKey,
        },
        body: JSON.stringify({ url: imageUrl }),
      }
    );

    if (!azureResponse.ok) {
      const errorText = await azureResponse.text();
      console.error('Azure CV API error:', errorText);
      throw new Error(`Azure CV API error: ${errorText}`);
    }

    const analysisResult = await azureResponse.json();
    console.log('Raw analysis result:', analysisResult);

    const rooms = [];
    const walls = [];
    let totalArea = 0;

    // Process rooms
    const detectedRooms = (analysisResult.objects || []).filter(obj => {
      const roomTags = ['room', 'bedroom', 'bathroom', 'kitchen', 'living room', 'dining room', 'garage'];
      return obj.tags?.some(tag => roomTags.includes(tag.toLowerCase()));
    });

    // Process text annotations for room labels
    const textAnnotations = analysisResult.readResult?.pages?.[0]?.lines || [];
    
    detectedRooms.forEach(room => {
      const dimensions = calculateDimensions(room.boundingBox);
      const nearbyText = textAnnotations
        .filter(text => isNearby(room.boundingBox, text.boundingBox))
        .map(text => text.text)
        .join(' ');

      const roomType = detectRoomType(nearbyText, room.tags || []);
      const features = extractFeatures(room, analysisResult.readResult?.pages?.[0]);

      rooms.push({
        type: roomType,
        dimensions,
        area: dimensions.area,
        features
      });

      totalArea += dimensions.area;

      // Generate walls for visualization
      const corners = getRoomCorners(room.boundingBox);
      corners.forEach((corner, i) => {
        const nextCorner = corners[(i + 1) % 4];
        walls.push({
          start: corner,
          end: nextCorner,
          height: 8
        });
      });
    });

    const materialEstimates = calculateMaterialEstimates(rooms);

    const result: AnalysisResult = {
      rooms,
      walls,
      totalArea,
      materialEstimates,
      customizationOptions: {
        flooring: MATERIAL_OPTIONS.flooring,
        paint: MATERIAL_OPTIONS.paint
      }
    };

    // Store analysis results
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('floor_plan_analyses')
      .insert({
        analysis_data: result,
        material_estimates: materialEstimates,
        customizations: result.customizationOptions
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing floor plan:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze floor plan', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

function getRoomCorners(boundingBox: any) {
  const { x, y, w, h } = boundingBox;
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h }
  ];
}

function isNearby(box1: any, box2: any): boolean {
  const maxDistance = 100;
  const center1 = {
    x: box1.x + box1.w / 2,
    y: box1.y + box1.h / 2
  };
  const center2 = {
    x: box2.x + box2.w / 2,
    y: box2.y + box2.h / 2
  };
  
  const distance = Math.sqrt(
    Math.pow(center1.x - center2.x, 2) + 
    Math.pow(center1.y - center2.y, 2)
  );
  
  return distance < maxDistance;
}