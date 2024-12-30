import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl, customizations } = await req.json();
    console.log('Received request with imageUrl:', imageUrl);

    // Validate image URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error('Invalid or missing image URL');
    }

    // Validate that the URL is accessible and is an image
    let imageResponse;
    try {
      imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        console.error('Image URL response not OK:', {
          status: imageResponse.status,
          statusText: imageResponse.statusText
        });
        throw new Error('Image URL is not accessible');
      }

      const contentType = imageResponse.headers.get('content-type');
      console.log('Content-Type from image URL:', contentType);
      
      if (!contentType?.toLowerCase().includes('image/')) {
        // Try to validate the URL by checking if it redirects to an image
        const finalUrl = imageResponse.url;
        console.log('Checking final URL after potential redirect:', finalUrl);
        
        if (finalUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          console.log('URL points to an image file based on extension');
        } else {
          throw new Error('URL does not point to a valid image');
        }
      }
    } catch (error) {
      console.error('Image URL validation error:', error);
      throw new Error(`Unable to access image URL: ${error.message}`);
    }

    const endpoint = Deno.env.get('AZURE_CV_ENDPOINT');
    const apiKey = Deno.env.get('AZURE_CV_KEY');

    if (!endpoint || !apiKey) {
      throw new Error('Azure CV credentials not configured');
    }

    console.log('Using Azure endpoint:', endpoint);

    // Make request to Azure Computer Vision with proper error handling
    const analysisUrl = `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read,objects`;
    console.log('Making request to Azure CV API:', analysisUrl);

    const response = await fetch(analysisUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': apiKey,
      },
      body: JSON.stringify({ url: imageUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Azure API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Azure CV API error (${response.status}): ${errorText}`);
    }

    const azureResult = await response.json();
    console.log('Azure CV Analysis Result:', JSON.stringify(azureResult, null, 2));

    // Extract room information with better error handling
    const rooms = azureResult.objects
      ?.filter((obj: any) => obj.tags?.includes('room'))
      .map((obj: any) => ({
        type: obj.tags[0] || 'room',
        dimensions: {
          width: Math.round(obj.boundingBox[2] * 0.1),
          length: Math.round(obj.boundingBox[3] * 0.1)
        },
        area: Math.round(obj.boundingBox[2] * obj.boundingBox[3] * 0.01),
        features: obj.tags.filter((tag: string) => 
          ['window', 'door', 'sink', 'bathtub', 'shower'].includes(tag)
        )
      })) || [];

    // Extract text information for room labels
    const textResults = azureResult.readResult?.pages?.[0] || {};
    
    // Calculate total area
    const totalArea = rooms.reduce((sum: number, room: any) => sum + room.area, 0);

    // Generate material estimates based on room data
    const materialEstimates = [
      {
        category: 'Flooring',
        items: [{
          name: 'Standard Flooring',
          quantity: totalArea,
          unit: 'sq ft',
          estimatedCost: totalArea * (customizations?.flooringCostPerSqFt || 5)
        }]
      },
      {
        category: 'Paint',
        items: rooms.map((room: any) => {
          const wallArea = (room.dimensions.length * 8 * 2) + (room.dimensions.width * 8 * 2);
          return {
            name: `${room.type} Paint`,
            quantity: wallArea,
            unit: 'sq ft',
            estimatedCost: wallArea * (customizations?.paintCostPerSqFt || 0.5)
          };
        })
      }
    ];

    const result = {
      rooms,
      totalArea,
      textResults,
      materialEstimates
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-floor-plan:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      }
    );
  }
});