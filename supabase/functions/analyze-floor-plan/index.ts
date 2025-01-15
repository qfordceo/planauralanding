import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    console.log('Processing floor plan:', imageUrl)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process the floor plan using Azure Computer Vision
    const azureEndpoint = Deno.env.get('AZURE_CV_ENDPOINT')
    const azureKey = Deno.env.get('AZURE_CV_KEY')

    if (!azureEndpoint || !azureKey) {
      throw new Error('Azure CV credentials not configured')
    }

    // Call Azure CV API to analyze the floor plan
    const azureResponse = await fetch(`${azureEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': azureKey,
      },
      body: JSON.stringify({ url: imageUrl }),
    })

    if (!azureResponse.ok) {
      throw new Error(`Azure CV API error: ${await azureResponse.text()}`)
    }

    const analysisResult = await azureResponse.json()
    console.log('Analysis result:', analysisResult)

    // Extract walls and rooms from the analysis
    const sceneData = {
      walls: extractWalls(analysisResult),
      rooms: extractRooms(analysisResult),
    }

    // Store the visualization data
    const { error: dbError } = await supabase
      .from('visualization_data')
      .insert({
        floor_plan_id: imageUrl.split('/').pop().split('.')[0],
        model_format: '3d',
        scene_data: sceneData,
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({ success: true, data: sceneData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing floor plan:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

function extractWalls(analysisResult: any) {
  const walls: any[] = []
  
  // Extract lines that could be walls
  if (analysisResult.objects) {
    analysisResult.objects.forEach((obj: any) => {
      if (obj.tags?.includes('wall')) {
        const box = obj.boundingBox
        walls.push({
          start: { x: box.x, y: box.y },
          end: { x: box.x + box.w, y: box.y },
          height: 2.4 // Standard wall height in meters
        })
      }
    })
  }
  
  return walls
}

function extractRooms(analysisResult: any) {
  const rooms: any[] = []
  
  // Extract polygons that could be rooms
  if (analysisResult.objects) {
    analysisResult.objects.forEach((obj: any) => {
      if (obj.tags?.includes('room')) {
        const box = obj.boundingBox
        rooms.push({
          points: [
            { x: box.x, y: box.y },
            { x: box.x + box.w, y: box.y },
            { x: box.x + box.w, y: box.y + box.h },
            { x: box.x, y: box.y + box.h }
          ],
          height: 2.4 // Standard room height in meters
        })
      }
    })
  }
  
  return rooms
}