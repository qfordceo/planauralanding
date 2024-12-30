import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Improved scale factor based on typical floor plan dimensions
const PIXELS_TO_FEET = 0.1;

function calculateRoomDimensions(boundingBox: number[]) {
  const width = Math.round(boundingBox[2] * PIXELS_TO_FEET);
  const length = Math.round(boundingBox[3] * PIXELS_TO_FEET);
  return {
    width,
    length,
    area: width * length
  };
}

function detectRoomType(text: string, features: string[]) {
  const roomTypes = {
    'bedroom': ['bed', 'bedroom', 'master', 'guest'],
    'bathroom': ['bath', 'bathroom', 'shower', 'wc'],
    'kitchen': ['kitchen', 'cooking', 'stove'],
    'living': ['living', 'family', 'great'],
    'dining': ['dining', 'dinner'],
    'garage': ['garage', 'parking'],
    'utility': ['utility', 'laundry'],
    'office': ['office', 'study', 'den']
  };

  const lowerText = text.toLowerCase();
  
  // Check text against room types
  for (const [type, keywords] of Object.entries(roomTypes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }

  // Check features for additional clues
  if (features.includes('sink') && features.includes('shower')) return 'bathroom';
  if (features.includes('sink') && !features.includes('shower')) return 'kitchen';
  if (features.includes('window') && features.length === 1) return 'living';
  
  return 'room';
}

function calculateMaterialEstimates(rooms: any[]) {
  const totalArea = rooms.reduce((sum, room) => sum + room.area, 0);
  const wallHeight = 8; // Standard ceiling height in feet
  
  const flooringOptions = [
    { name: 'Standard Carpet', costPerSqFt: 3 },
    { name: 'Hardwood', costPerSqFt: 8 },
    { name: 'Luxury Vinyl', costPerSqFt: 4 },
    { name: 'Ceramic Tile', costPerSqFt: 6 }
  ];

  const paintOptions = [
    { name: 'Basic Paint', costPerSqFt: 0.5 },
    { name: 'Premium Paint', costPerSqFt: 0.8 },
    { name: 'Designer Paint', costPerSqFt: 1.2 }
  ];

  const roomEstimates = rooms.map(room => {
    const wallArea = ((room.dimensions.width + room.dimensions.length) * 2) * wallHeight;
    return {
      name: room.type,
      flooring: {
        area: room.area,
        estimates: flooringOptions.map(option => ({
          type: option.name,
          cost: room.area * option.costPerSqFt
        }))
      },
      paint: {
        area: wallArea,
        estimates: paintOptions.map(option => ({
          type: option.name,
          cost: wallArea * option.costPerSqFt
        }))
      }
    };
  });

  return {
    totalArea,
    rooms: roomEstimates,
    flooringOptions,
    paintOptions
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    console.log('Processing floor plan:', imageUrl);

    // Validate image URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Image URL is not accessible');
    }

    const contentType = imageResponse.headers.get('content-type');
    if (!contentType?.toLowerCase().includes('image/')) {
      throw new Error('URL does not point to a valid image');
    }

    const endpoint = Deno.env.get('AZURE_CV_ENDPOINT');
    const apiKey = Deno.env.get('AZURE_CV_KEY');

    if (!endpoint || !apiKey) {
      throw new Error('Azure CV credentials not configured');
    }

    // Make request to Azure Computer Vision
    const analysisUrl = `${endpoint}/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read,objects,tags`;
    console.log('Making request to Azure CV API');

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
          ['room', 'bedroom', 'bathroom', 'kitchen', 'living'].includes(tag.toLowerCase()))) {
          
          const dimensions = calculateRoomDimensions(obj.boundingBox);
          
          // Find nearby text for room identification
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

    // Calculate material estimates
    const materialEstimates = calculateMaterialEstimates(detectedRooms);

    const result = {
      rooms: detectedRooms,
      totalArea: materialEstimates.totalArea,
      materialEstimates: materialEstimates.rooms,
      customizationOptions: {
        flooring: materialEstimates.flooringOptions,
        paint: materialEstimates.paintOptions
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