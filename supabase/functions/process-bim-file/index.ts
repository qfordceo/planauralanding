import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { IfcAPI } from 'https://esm.sh/web-ifc@0.0.46'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileUrl, fileType } = await req.json()
    console.log('Processing BIM file:', { fileUrl, fileType })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the file
    const response = await fetch(fileUrl)
    const fileBuffer = await response.arrayBuffer()

    let sceneData
    
    switch (fileType.toLowerCase()) {
      case 'ifc':
        sceneData = await processIFCFile(fileBuffer)
        break
      case 'dwg':
        sceneData = await processDWGFile(fileBuffer)
        break
      case 'rvt':
        sceneData = await processRevitFile(fileBuffer)
        break
      default:
        throw new Error('Unsupported file format')
    }

    // Store the processed data
    const { data, error } = await supabase
      .from('visualization_data')
      .insert({
        model_format: 'three-js',
        scene_data: sceneData,
        materials_data: {},
        lighting_data: { ambient: 0.5, directional: 0.8 },
        camera_positions: [
          { position: { x: 0, y: 5, z: 10 }, target: { x: 0, y: 0, z: 0 } }
        ]
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing BIM file:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function processIFCFile(buffer: ArrayBuffer) {
  const ifcApi = new IfcAPI()
  await ifcApi.Init()
  
  const modelID = await ifcApi.OpenModel(new Uint8Array(buffer))
  
  // Extract walls
  const walls = await ifcApi.GetLineIDsWithType(modelID, ifcApi.IFCWALL)
  const wallsGeometry = await Promise.all(
    walls.map(async (id: number) => {
      const wallData = await ifcApi.GetLine(modelID, id)
      return {
        type: 'wall',
        geometry: wallData.geometry,
        properties: wallData.properties
      }
    })
  )

  // Extract spaces/rooms
  const spaces = await ifcApi.GetLineIDsWithType(modelID, ifcApi.IFCSPACE)
  const spacesGeometry = await Promise.all(
    spaces.map(async (id: number) => {
      const spaceData = await ifcApi.GetLine(modelID, id)
      return {
        type: 'room',
        geometry: spaceData.geometry,
        properties: spaceData.properties
      }
    })
  )

  await ifcApi.CloseModel(modelID)

  return {
    walls: wallsGeometry,
    rooms: spacesGeometry
  }
}

async function processDWGFile(buffer: ArrayBuffer) {
  // Implement DWG processing logic
  // This would require additional libraries or services
  throw new Error('DWG processing not yet implemented')
}

async function processRevitFile(buffer: ArrayBuffer) {
  // Implement Revit processing logic
  // This would require additional libraries or services
  throw new Error('Revit processing not yet implemented')
}