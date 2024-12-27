import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0"
import QRCode from "https://esm.sh/qrcode@1.5.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { listingId } = await req.json()
    if (!listingId) {
      throw new Error('Listing ID is required')
    }

    // Generate QR code
    const qrUrl = `${req.headers.get('origin')}/land/${listingId}`
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl)

    // Upload QR code to storage
    const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64')
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from('land-listings')
      .upload(`qr-codes/${listingId}.png`, qrCodeBuffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (uploadError) throw uploadError

    // Update listing with QR code URL
    const { data: publicUrl } = supabaseClient
      .storage
      .from('land-listings')
      .getPublicUrl(`qr-codes/${listingId}.png`)

    const { error: updateError } = await supabaseClient
      .from('land_listings')
      .update({
        qr_code_generated: true,
        qr_code_url: publicUrl.publicUrl
      })
      .eq('id', listingId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, qrCodeUrl: publicUrl.publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})