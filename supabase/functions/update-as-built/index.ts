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
    const { modelId, asBuiltData, materials } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update the BIM model
    const { data: modelData, error: modelError } = await supabase
      .from('bim_models')
      .update({
        model_data: asBuiltData,
        is_as_built: true,
        as_built_date: new Date().toISOString(),
        processing_status: 'completed'
      })
      .eq('id', modelId)
      .select()
      .single()

    if (modelError) throw modelError

    // Update materials if provided
    if (materials && materials.length > 0) {
      const { error: materialsError } = await supabase
        .from('bim_materials')
        .upsert(
          materials.map((material: any) => ({
            bim_model_id: modelId,
            ...material,
            updated_at: new Date().toISOString()
          }))
        )

      if (materialsError) throw materialsError
    }

    return new Response(
      JSON.stringify({ success: true, data: modelData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})