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
    try {
      const urlCheck = await fetch(imageUrl, { method: 'HEAD' });
      if (!urlCheck.ok) {
        throw new Error('Image URL is not accessible');
      }
      const contentType = urlCheck.headers.get('content-type');
      if (!contentType?.startsWith('image/')) {
        throw new Error('URL does not point to a valid image');
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
    const analysisUrl = `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=objects,text,tags`;
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

    // Detect electrical elements
    const electricalElements = azureResult.objects
      ?.filter((obj: any) => 
        obj.tags?.some((tag: string) => 
          ['outlet', 'switch', 'light_fixture'].includes(tag)
        )
      )
      .map((obj: any) => ({
        type: obj.tags.find((tag: string) => 
          ['outlet', 'switch', 'light_fixture'].includes(tag)
        ),
        position: {
          x: obj.boundingBox[0],
          y: obj.boundingBox[1]
        }
      })) || [];

    // Calculate material estimates
    const totalArea = rooms.reduce((sum: number, room: any) => sum + room.area, 0);
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
      electricalLayout: {
        elements: electricalElements
      },
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