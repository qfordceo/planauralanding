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
    console.log('Processing video:', filePath, 'for contractor:', contractorId)

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update status to processing
    await supabaseAdmin
      .from('inspection_videos')
      .update({ processing_status: 'processing' })
      .eq('storage_path', filePath)
      .eq('contractor_id', contractorId)

    // Download video from storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('inspection-videos')
      .download(filePath)

    if (downloadError) {
      console.error('Download error:', downloadError)
      throw downloadError
    }

    try {
      // Process video using FFmpeg
      const command = new Deno.Command('ffmpeg', {
        args: [
          '-i', 'pipe:0',
          '-vf', 'scale=1280:-1',  // Scale to 720p while maintaining aspect ratio
          '-c:v', 'libx264',       // Use H.264 codec
          '-preset', 'medium',     // Balance between speed and quality
          '-crf', '23',           // Constant Rate Factor (18-28 is good)
          '-c:a', 'aac',          // Audio codec
          '-b:a', '128k',         // Audio bitrate
          '-movflags', '+faststart', // Enable fast start for web playback
          '-f', 'mp4',            // Output format
          'pipe:1'                // Output to pipe
        ],
        stdin: 'piped',
        stdout: 'piped',
        stderr: 'piped',
      })

      const process = command.spawn()
      const writer = process.stdin.getWriter()
      
      // Write file data to FFmpeg
      await writer.write(await fileData.arrayBuffer())
      await writer.close()

      // Get processed video data
      const { stdout, stderr } = await process.output()
      
      if (stderr.length > 0) {
        console.log('FFmpeg stderr:', new TextDecoder().decode(stderr))
      }

      const processedVideo = new Uint8Array(stdout)

      // Upload processed video
      const processedPath = filePath.replace(/\.[^/.]+$/, '_processed.mp4')
      const { error: uploadError } = await supabaseAdmin.storage
        .from('inspection-videos')
        .upload(processedPath, processedVideo, {
          contentType: 'video/mp4',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

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
    } catch (ffmpegError) {
      console.error('FFmpeg processing error:', ffmpegError)
      
      // Update database with error
      await supabaseAdmin
        .from('inspection_videos')
        .update({
          processing_status: 'error',
          processing_error: ffmpegError.message
        })
        .eq('contractor_id', contractorId)
        .eq('storage_path', filePath)

      throw ffmpegError
    }
  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})