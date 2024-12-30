import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisResult {
  rooms: {
    type: string;
    dimensions: {
      width: number;
      length: number;
    };
    area: number;
    features: string[];
  }[];
  totalArea: number;
  materialEstimates: {
    category: string;
    items: {
      name: string;
      quantity: number;
      unit: string;
      estimatedCost: number;
    }[];
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl, customizations } = await req.json()
    
    // Azure Computer Vision API configuration
    const endpoint = Deno.env.get('AZURE_CV_ENDPOINT')
    const apiKey = Deno.env.get('AZURE_CV_KEY')

    if (!endpoint || !apiKey) {
      throw new Error('Azure CV credentials not configured')
    }

    // Analyze image using Azure Computer Vision
    const analysisUrl = `${endpoint}computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,text`
    const response = await fetch(analysisUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey,
      },
      body: JSON.stringify({
        url: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error(`Azure CV API error: ${response.statusText}`)
    }

    const azureResult = await response.json()
    console.log('Azure CV Analysis Result:', azureResult)

    // Process the Azure results into our format
    const result: AnalysisResult = {
      rooms: [],
      totalArea: 0,
      materialEstimates: []
    }

    // Extract room information from Azure's analysis
    if (azureResult.objects) {
      azureResult.objects.forEach((obj: any) => {
        if (obj.tags?.includes('room')) {
          const dimensions = calculateDimensions(obj.boundingBox)
          result.rooms.push({
            type: obj.tags[0] || 'room',
            dimensions: dimensions,
            area: dimensions.width * dimensions.length,
            features: extractFeatures(obj, azureResult.text)
          })
        }
      })
    }

    // Calculate total area
    result.totalArea = result.rooms.reduce((total, room) => total + room.area, 0)

    // Calculate material estimates based on the analysis
    result.materialEstimates = calculateMaterialEstimates(result.rooms, customizations)

    // Store the analysis result in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('floor_plan_analyses')
      .insert({
        analysis_data: azureResult,
        material_estimates: result.materialEstimates,
        customizations
      })

    if (dbError) {
      console.error('Error storing analysis:', dbError)
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error analyzing floor plan:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

function calculateDimensions(boundingBox: number[]) {
  // Convert pixel dimensions to approximate real-world dimensions
  // This is a simplified calculation - would need calibration in production
  const pixelToFeet = 0.1 // Example conversion factor
  return {
    width: Math.round(boundingBox[2] * pixelToFeet),
    length: Math.round(boundingBox[3] * pixelToFeet)
  }
}

function extractFeatures(obj: any, textResults: any) {
  const features: string[] = []
  
  // Extract features from object tags
  if (obj.tags) {
    features.push(...obj.tags.filter((tag: string) => 
      ['window', 'door', 'sink', 'bathtub', 'shower'].includes(tag)
    ))
  }

  // Extract features from text analysis
  if (textResults?.lines) {
    textResults.lines.forEach((line: any) => {
      if (isWithinBoundingBox(line.boundingBox, obj.boundingBox)) {
        features.push(line.text)
      }
    })
  }

  return features
}

function isWithinBoundingBox(innerBox: number[], outerBox: number[]) {
  return (
    innerBox[0] >= outerBox[0] &&
    innerBox[1] >= outerBox[1] &&
    innerBox[0] + innerBox[2] <= outerBox[0] + outerBox[2] &&
    innerBox[1] + innerBox[3] <= outerBox[1] + outerBox[3]
  )
}

function calculateMaterialEstimates(
  rooms: AnalysisResult['rooms'], 
  customizations?: Record<string, any>
): AnalysisResult['materialEstimates'] {
  const estimates = [
    {
      category: 'Flooring',
      items: rooms.map(room => ({
        name: `${room.type} Flooring`,
        quantity: room.area,
        unit: 'sq ft',
        estimatedCost: room.area * (customizations?.flooringCostPerSqFt || 5)
      }))
    },
    {
      category: 'Paint',
      items: rooms.map(room => {
        const wallArea = (room.dimensions.length * 8 * 2) + (room.dimensions.width * 8 * 2)
        return {
          name: `${room.type} Paint`,
          quantity: wallArea,
          unit: 'sq ft',
          estimatedCost: wallArea * (customizations?.paintCostPerSqFt || 0.5)
        }
      })
    },
    {
      category: 'Electrical',
      items: rooms.map(room => ({
        name: `${room.type} Electrical`,
        quantity: Math.ceil(room.area / 100), // One outlet per 100 sq ft
        unit: 'outlets',
        estimatedCost: Math.ceil(room.area / 100) * (customizations?.outletCost || 20)
      }))
    },
    {
      category: 'Fixtures',
      items: rooms.flatMap(room => 
        room.features
          .filter(feature => ['sink', 'bathtub', 'shower'].includes(feature))
          .map(feature => ({
            name: `${feature} (${room.type})`,
            quantity: 1,
            unit: 'piece',
            estimatedCost: customizations?.fixtureCosts?.[feature] || 200
          }))
      )
    }
  ]

  return estimates
}