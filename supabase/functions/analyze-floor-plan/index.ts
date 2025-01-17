import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    console.log('Processing floor plan:', imageUrl)

    // Initialize Azure Computer Vision client
    const azureEndpoint = Deno.env.get('AZURE_CV_ENDPOINT')
    const azureKey = Deno.env.get('AZURE_CV_KEY')

    if (!azureEndpoint || !azureKey) {
      throw new Error('Azure CV credentials not configured')
    }

    // Call Azure CV API to analyze the floor plan
    const azureResponse = await fetch(`${azureEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,tags,read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': azureKey,
      },
      body: JSON.stringify({ url: imageUrl }),
    })

    if (!azureResponse.ok) {
      const errorText = await azureResponse.text()
      console.error('Azure CV API error:', errorText)
      throw new Error(`Azure CV API error: ${errorText}`)
    }

    const analysisResult = await azureResponse.json()
    console.log('Analysis result:', analysisResult)

    // Process the analysis result
    const rooms = []
    const totalArea = 0
    const materialEstimates = []

    if (analysisResult.objects) {
      // Process detected objects to identify rooms
      for (const obj of analysisResult.objects) {
        if (obj.tags?.includes('room')) {
          const width = Math.round(obj.boundingBox.w * 0.1) // Convert pixels to feet
          const length = Math.round(obj.boundingBox.h * 0.1)
          const area = width * length

          rooms.push({
            type: 'room',
            dimensions: { width, length },
            area,
            features: obj.tags.filter(tag => ['window', 'door', 'sink', 'bathtub', 'shower'].includes(tag))
          })
        }
      }
    }

    // Create response data
    const responseData = {
      rooms,
      totalArea: rooms.reduce((sum, room) => sum + room.area, 0),
      materialEstimates: [
        {
          name: 'Flooring',
          flooring: {
            area: totalArea,
            estimates: [
              { type: 'Standard', cost: totalArea * 5 }
            ]
          },
          paint: {
            area: rooms.reduce((sum, room) => {
              const wallHeight = 8 // feet
              const perimeter = (room.dimensions.width + room.dimensions.length) * 2
              return sum + (perimeter * wallHeight)
            }, 0),
            estimates: [
              { type: 'Standard', cost: totalArea * 0.5 }
            ]
          }
        }
      ],
      customizationOptions: {
        flooring: [
          { name: 'Standard Carpet', costPerSqFt: 3 },
          { name: 'Hardwood', costPerSqFt: 8 },
          { name: 'Luxury Vinyl', costPerSqFt: 4 },
          { name: 'Ceramic Tile', costPerSqFt: 6 }
        ],
        paint: [
          { name: 'Basic Paint', costPerSqFt: 0.5 },
          { name: 'Premium Paint', costPerSqFt: 0.8 },
          { name: 'Designer Paint', costPerSqFt: 1.2 }
        ]
      }
    }

    // Store the analysis result
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('floor_plan_analyses')
      .insert({
        floor_plan_id: null, // This will be updated by the client if needed
        analysis_data: responseData,
        material_estimates: responseData.materialEstimates,
        customizations: responseData.customizationOptions
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue even if storage fails - we still want to return the analysis
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing floor plan:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze floor plan', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})