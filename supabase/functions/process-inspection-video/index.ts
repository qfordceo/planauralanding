import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { filePath, contractorId } = await req.json()

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // For now, we'll mark the video as processed without actual processing
    // This is temporary until we can set up proper video processing
    const { error: updateError } = await supabaseAdmin
      .from('inspection_videos')
      .update({
        processing_status: 'completed',
        format: 'video/mp4'
      })
      .eq('contractor_id', contractorId)
      .eq('storage_path', filePath)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ message: 'Video marked as processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})