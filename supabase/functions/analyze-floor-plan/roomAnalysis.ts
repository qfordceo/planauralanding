const PIXELS_TO_FEET = 0.1;

export function calculateRoomDimensions(boundingBox: number[]) {
  const width = Math.round(boundingBox[2] * PIXELS_TO_FEET);
  const length = Math.round(boundingBox[3] * PIXELS_TO_FEET);
  return {
    width,
    length,
    area: width * length
  };
}

export function detectRoomType(text: string, features: string[]) {
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
  
  for (const [type, keywords] of Object.entries(roomTypes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }

  if (features.includes('sink') && features.includes('shower')) return 'bathroom';
  if (features.includes('sink') && !features.includes('shower')) return 'kitchen';
  if (features.includes('window') && features.length === 1) return 'living';
  
  return 'room';
}

export function calculateMaterialEstimates(rooms: any[]) {
  const totalArea = rooms.reduce((sum, room) => sum + room.area, 0);
  const wallHeight = 8;
  
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