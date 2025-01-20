import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { decode as base64Decode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

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

    // Download video from storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('inspection-videos')
      .download(filePath)

    if (downloadError) throw downloadError

    // Process video using FFmpeg
    const command = new Deno.Command('ffmpeg', {
      args: [
        '-i', 'pipe:0',
        '-vf', 'scale=640:-1',
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-f', 'mp4',
        'pipe:1'
      ],
      stdin: 'piped',
      stdout: 'piped',
    })

    const process = command.spawn()
    const writer = process.stdin.getWriter()
    
    // Write file data to FFmpeg
    await writer.write(await fileData.arrayBuffer())
    await writer.close()

    // Get processed video data
    const { stdout } = await process.output()
    const processedVideo = new Uint8Array(stdout)

    // Upload processed video
    const processedPath = `${filePath.split('.')[0]}_processed.mp4`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('inspection-videos')
      .upload(processedPath, processedVideo, {
        contentType: 'video/mp4',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Update database record
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
      JSON.stringify({ message: 'Video processed successfully' }),
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