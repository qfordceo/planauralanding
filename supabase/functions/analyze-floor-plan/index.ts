import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, downloadImageFromStorage, downloadExternalImage, analyzeImageWithAzure } from './utils.ts'
import { processAnalysisResult } from './analysis.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json();
    console.log('Processing floor plan:', imageUrl);

    let imageBuffer;
    try {
      if (imageUrl.includes(Deno.env.get('SUPABASE_URL') ?? '')) {
        imageBuffer = await downloadImageFromStorage(imageUrl);
      } else {
        imageBuffer = await downloadExternalImage(imageUrl);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
      return new Response(
        JSON.stringify({ 
          error: error.message || 'Failed to download image',
          details: error.toString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    const azureResult = await analyzeImageWithAzure(imageBuffer);
    console.log('Azure CV Analysis Result:', JSON.stringify(azureResult, null, 2));

    const result = processAnalysisResult(azureResult);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-floor-plan:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});