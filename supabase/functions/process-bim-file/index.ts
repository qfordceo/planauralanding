import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { IfcAPI } from 'https://esm.sh/web-ifc@0.0.46'

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
    const { fileUrl, fileType } = await req.json()
    console.log(`Processing ${fileType} file from ${fileUrl}`)

    if (!fileUrl) {
      throw new Error('No file URL provided')
    }

    const api = new IfcAPI()
    await api.Init()

    // Download the file
    const response = await fetch(fileUrl)
    const buffer = await response.arrayBuffer()
    
    // Load the IFC file
    const modelID = api.OpenModel(new Uint8Array(buffer))
    
    // Extract walls and spaces
    const walls = api.GetLineIDsWithType(modelID, api.IFCWALL)
    const spaces = api.GetLineIDsWithType(modelID, api.IFCSPACE)
    
    const wallsData = walls.map(id => {
      const wall = api.GetLine(modelID, id)
      return {
        id: id,
        type: 'wall',
        properties: wall
      }
    })

    const spacesData = spaces.map(id => {
      const space = api.GetLine(modelID, id)
      return {
        id: id,
        type: 'space',
        properties: space
      }
    })

    // Close the model to free memory
    api.CloseModel(modelID)

    // Create visualization data
    const visualizationData = {
      walls: wallsData,
      spaces: spacesData,
      metadata: {
        fileType,
        processedAt: new Date().toISOString()
      }
    }

    // Store the visualization data
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data, error } = await supabase
      .from('visualization_data')
      .insert([{
        floor_plan_id: null, // This will be updated by the client
        model_format: fileType,
        scene_data: visualizationData
      }])
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing BIM file:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})