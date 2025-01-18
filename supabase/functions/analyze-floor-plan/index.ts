import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PIXELS_TO_FEET_RATIO = 0.05;

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

    const azureEndpoint = Deno.env.get('AZURE_CV_ENDPOINT')
    const azureKey = Deno.env.get('AZURE_CV_KEY')

    if (!azureEndpoint || !azureKey) {
      throw new Error('Azure CV credentials not configured')
    }

    // Call Azure CV API with only the features we need for floor plan analysis
    const azureResponse = await fetch(`${azureEndpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,tags,read&language=en&model-version=latest`, {
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

    // Process detected objects for room identification
    const rooms = []
    const walls = []
    let totalArea = 0

    const detectedRooms = (analysisResult.objects || []).filter(obj => {
      const roomTags = ['room', 'bedroom', 'bathroom', 'kitchen', 'living room', 'dining room', 'garage']
      return obj.tags?.some(tag => roomTags.includes(tag.toLowerCase()))
    })

    // Process text annotations for room labels
    const textAnnotations = analysisResult.readResult?.pages?.[0]?.lines || []
    const roomLabels = new Map()

    textAnnotations.forEach(text => {
      const lowerText = text.text.toLowerCase()
      if (lowerText.includes('room') || lowerText.includes('kitchen') || lowerText.includes('bath')) {
        const box = text.boundingBox
        roomLabels.set(JSON.stringify(box), text.text)
      }
    })

    // Process each detected room
    detectedRooms.forEach(room => {
      const width = Math.round(room.boundingBox.w * PIXELS_TO_FEET_RATIO)
      const length = Math.round(room.boundingBox.h * PIXELS_TO_FEET_RATIO)
      const area = width * length

      // Detect room features
      const features = []
      if (room.tags) {
        const featureTypes = ['window', 'door', 'sink', 'bathtub', 'shower', 'closet']
        room.tags.forEach(tag => {
          if (featureTypes.includes(tag.toLowerCase())) {
            features.push(tag.toLowerCase())
          }
        })
      }

      // Find closest room label
      let roomType = 'room'
      roomLabels.forEach((label, boxStr) => {
        const box = JSON.parse(boxStr)
        if (isNearby(room.boundingBox, box)) {
          roomType = determineRoomType(label)
        }
      })

      rooms.push({
        type: roomType,
        dimensions: { width, length },
        area,
        features
      })

      // Create walls for visualization
      const corners = getRoomCorners(room.boundingBox)
      corners.forEach((corner, i) => {
        const nextCorner = corners[(i + 1) % 4]
        walls.push({
          start: { x: corner.x, y: corner.y },
          end: { x: nextCorner.x, y: nextCorner.y },
          height: 8 // Standard wall height
        })
      })

      totalArea += area
    })

    const responseData = {
      rooms,
      walls,
      totalArea,
      materialEstimates: calculateMaterialEstimates(rooms),
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
function determineRoomType(text: string): string {
  const lowerText = text.toLowerCase()
  const roomTypes = {
    bedroom: ['bed', 'bedroom', 'master'],
    bathroom: ['bath', 'bathroom', 'shower', 'wc'],
    kitchen: ['kitchen', 'cooking'],
    living: ['living', 'family', 'great'],
    dining: ['dining', 'dinner'],
    garage: ['garage', 'parking']
  }

  for (const [type, keywords] of Object.entries(roomTypes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type
    }
  }

  return 'room'
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

function isNearby(box1: any, box2: any): boolean {
  const maxDistance = 100 // pixels
  const center1 = {
    x: box1.x + box1.w / 2,
    y: box1.y + box1.h / 2
  }
  const center2 = {
    x: box2.x + box2.w / 2,
    y: box2.y + box2.h / 2
  }
  
  const distance = Math.sqrt(
    Math.pow(center1.x - center2.x, 2) + 
    Math.pow(center1.y - center2.y, 2)
  )
  
  return distance < maxDistance
}

function calculateMaterialEstimates(rooms: any[]) {
  return rooms.map(room => ({
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
}

function calculateWallArea(room: any): number {
  const perimeter = 2 * (room.dimensions.width + room.dimensions.length)
  const wallHeight = 8 // Standard ceiling height
  return perimeter * wallHeight
}