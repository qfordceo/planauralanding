import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to calculate room area from detected objects
function calculateRoomArea(boundingBox: number[]) {
  // Assuming the floor plan scale is approximately 1 pixel = 0.5 feet
  const SCALE_FACTOR = 0.5;
  const width = boundingBox[2] * SCALE_FACTOR;
  const length = boundingBox[3] * SCALE_FACTOR;
  return {
    width: Math.round(width),
    length: Math.round(length),
    area: Math.round(width * length)
  };
}

// Helper function to detect room type from text and features
function detectRoomType(text: string, features: string[]) {
  const roomTypes = {
    'bedroom': ['bed', 'bedroom', 'master', 'guest room'],
    'bathroom': ['bath', 'bathroom', 'powder room', 'shower'],
    'kitchen': ['kitchen', 'cooking', 'stove', 'sink'],
    'living': ['living', 'family room', 'great room'],
    'dining': ['dining', 'dinner'],
    'garage': ['garage', 'car', 'parking'],
  };

  const lowerText = text.toLowerCase();
  for (const [type, keywords] of Object.entries(roomTypes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }

  // Check features for additional clues
  if (features.includes('sink') && features.includes('shower')) return 'bathroom';
  if (features.includes('sink') && !features.includes('shower')) return 'kitchen';
  
  return 'room';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl, customizations } = await req.json();
    console.log('Processing floor plan:', imageUrl);

    // Validate image URL
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
        const finalUrl = imageResponse.url;
        console.log('Checking final URL after potential redirect:', finalUrl);
        
        if (!finalUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
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

    // Make request to Azure Computer Vision
    const analysisUrl = `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read,objects,tags`;
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

    // Process detected objects and text to identify rooms
    const detectedRooms = [];
    const processedAreas = new Set();

    // First, process objects tagged as rooms
    if (azureResult.objects) {
      for (const obj of azureResult.objects) {
        if (obj.tags?.some((tag: string) => 
          ['room', 'bedroom', 'bathroom', 'kitchen', 'living room'].includes(tag.toLowerCase()))) {
          
          const dimensions = calculateRoomArea(obj.boundingBox);
          const nearbyText = azureResult.readResult?.pages?.[0]?.lines
            ?.filter((line: any) => {
              const lineBox = line.boundingBox;
              return Math.abs(lineBox[0] - obj.boundingBox[0]) < 100 &&
                     Math.abs(lineBox[1] - obj.boundingBox[1]) < 100;
            })
            ?.map((line: any) => line.text)
            ?.join(' ') || '';

          const roomType = detectRoomType(nearbyText, obj.tags);
          
          detectedRooms.push({
            type: roomType,
            dimensions: {
              width: dimensions.width,
              length: dimensions.length
            },
            area: dimensions.area,
            features: obj.tags.filter((tag: string) => 
              ['window', 'door', 'sink', 'bathtub', 'shower', 'closet'].includes(tag))
          });

          processedAreas.add(`${obj.boundingBox.join(',')}`);
        }
      }
    }

    // Calculate total area and prepare material estimates
    const totalArea = detectedRooms.reduce((sum, room) => sum + room.area, 0);
    
    // Calculate wall areas for paint
    const wallAreas = detectedRooms.map(room => {
      const wallHeight = 8; // Standard wall height in feet
      const perimeter = 2 * (room.dimensions.width + room.dimensions.length);
      return {
        roomType: room.type,
        area: perimeter * wallHeight
      };
    });

    const totalWallArea = wallAreas.reduce((sum, wall) => sum + wall.area, 0);

    // Generate material estimates based on room data
    const materialEstimates = [
      {
        category: 'Flooring',
        items: [
          {
            name: 'Standard Flooring',
            quantity: totalArea,
            unit: 'sq ft',
            estimatedCost: totalArea * (customizations?.flooringCostPerSqFt || 5)
          }
        ]
      },
      {
        category: 'Paint',
        items: wallAreas.map(wall => ({
          name: `${wall.roomType.charAt(0).toUpperCase() + wall.roomType.slice(1)} Paint`,
          quantity: wall.area,
          unit: 'sq ft',
          estimatedCost: wall.area * (customizations?.paintCostPerSqFt || 0.5)
        }))
      }
    ];

    const result = {
      rooms: detectedRooms,
      totalArea,
      totalWallArea,
      materialEstimates,
      customizationOptions: {
        flooring: [
          { name: 'Standard Carpet', costPerSqFt: 3 },
          { name: 'Hardwood', costPerSqFt: 8 },
          { name: 'Tile', costPerSqFt: 6 },
          { name: 'Luxury Vinyl', costPerSqFt: 4 }
        ],
        paint: [
          { name: 'Standard Paint', costPerSqFt: 0.5 },
          { name: 'Premium Paint', costPerSqFt: 0.8 },
          { name: 'Designer Paint', costPerSqFt: 1.2 }
        ]
      }
    };

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