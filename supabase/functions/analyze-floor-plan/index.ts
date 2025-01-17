import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PIXELS_TO_FEET_RATIO = 0.08; // Calibrated ratio for more accurate measurements

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('No image URL provided')
    }

    console.log('Processing floor plan:', imageUrl)

    const azureEndpoint = Deno.env.get('AZURE_CV_ENDPOINT')
    const azureKey = Deno.env.get('AZURE_CV_KEY')

    if (!azureEndpoint || !azureKey) {
      throw new Error('Azure CV credentials not configured')
    }

    // Call Azure CV API with enhanced parameters
    const azureResponse = await fetch(`${azureEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,tags,read,caption&language=en&model-version=latest`, {
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
    console.log('Raw analysis result:', analysisResult)

    // Enhanced room detection and measurement
    const rooms = []
    const walls = []
    let totalArea = 0

    if (analysisResult.objects) {
      // Improved room detection algorithm
      const detectedRooms = analysisResult.objects.filter(obj => 
        obj.tags?.some(tag => 
          ['room', 'bedroom', 'bathroom', 'kitchen', 'living room'].includes(tag.toLowerCase())
        )
      )

      detectedRooms.forEach(room => {
        // Calculate more accurate dimensions
        const width = Math.round(room.boundingBox.w * PIXELS_TO_FEET_RATIO)
        const length = Math.round(room.boundingBox.h * PIXELS_TO_FEET_RATIO)
        const area = width * length

        // Detect room type using both object tags and text recognition
        const roomType = determineRoomType(room, analysisResult.readResult)

        // Detect features within the room
        const features = detectRoomFeatures(room, analysisResult.objects)

        rooms.push({
          type: roomType,
          dimensions: { width, length },
          area,
          features
        })

        // Create walls for visualization
        const roomCorners = getRoomCorners(room.boundingBox)
        roomCorners.forEach((corner, i) => {
          const nextCorner = roomCorners[(i + 1) % 4]
          walls.push({
            start: { x: corner.x, y: corner.y },
            end: { x: nextCorner.x, y: nextCorner.y },
            height: 8 // Standard wall height
          })
        })

        totalArea += area
      })
    }

    // Calculate material estimates with improved accuracy
    const materialEstimates = rooms.map(room => ({
      name: room.type,
      flooring: {
        area: room.area,
        estimates: [
          { type: 'Standard', cost: room.area * 5 }
        ]
      },
      paint: {
        area: calculateWallArea(room),
        estimates: [
          { type: 'Standard', cost: calculateWallArea(room) * 0.5 }
        ]
      }
    }))

    const responseData = {
      rooms,
      walls,
      totalArea,
      materialEstimates,
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

    // Store analysis results
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('floor_plan_analyses')
      .insert({
        floor_plan_id: null,
        analysis_data: responseData,
        material_estimates: responseData.materialEstimates,
        customizations: responseData.customizationOptions
      })

    if (dbError) {
      console.error('Database error:', dbError)
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

// Helper functions
function determineRoomType(room: any, readResult: any): string {
  const roomTypes = {
    bedroom: ['bed', 'bedroom', 'master'],
    bathroom: ['bath', 'bathroom', 'shower', 'toilet'],
    kitchen: ['kitchen', 'cooking', 'dining'],
    living: ['living', 'family', 'great'],
    office: ['office', 'study', 'den']
  }

  // Check object tags
  for (const [type, keywords] of Object.entries(roomTypes)) {
    if (room.tags?.some((tag: string) => 
      keywords.some(keyword => tag.toLowerCase().includes(keyword))
    )) {
      return type
    }
  }

  // Check nearby text
  if (readResult?.pages?.[0]?.lines) {
    const nearbyText = readResult.pages[0].lines
      .filter((line: any) => isNearby(room.boundingBox, line.boundingBox))
      .map((line: any) => line.text.toLowerCase())
      .join(' ')

    for (const [type, keywords] of Object.entries(roomTypes)) {
      if (keywords.some(keyword => nearbyText.includes(keyword))) {
        return type
      }
    }
  }

  return 'room'
}

function detectRoomFeatures(room: any, objects: any[]): string[] {
  const features = new Set<string>()
  const featureTypes = ['window', 'door', 'sink', 'bathtub', 'shower', 'toilet', 'closet']

  objects.forEach(obj => {
    if (isWithinBounds(obj.boundingBox, room.boundingBox)) {
      obj.tags?.forEach((tag: string) => {
        if (featureTypes.includes(tag.toLowerCase())) {
          features.add(tag.toLowerCase())
        }
      })
    }
  })

  return Array.from(features)
}

function getRoomCorners(boundingBox: any) {
  const { x, y, w, h } = boundingBox
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h }
  ]
}

function calculateWallArea(room: any): number {
  const perimeter = 2 * (room.dimensions.width + room.dimensions.length)
  const wallHeight = 8 // Standard ceiling height
  return perimeter * wallHeight
}

function isNearby(box1: any, box2: any): boolean {
  const maxDistance = 100 // pixels
  return Math.abs(box1.x - box2.x) < maxDistance && 
         Math.abs(box1.y - box2.y) < maxDistance
}

function isWithinBounds(innerBox: any, outerBox: any): boolean {
  return innerBox.x >= outerBox.x &&
         innerBox.y >= outerBox.y &&
         innerBox.x + innerBox.w <= outerBox.x + outerBox.w &&
         innerBox.y + innerBox.h <= outerBox.y + outerBox.h
}