import type { Room, MaterialCategory } from '@/types/floor-plans';

export function calculateDimensions(boundingBox: number[]) {
  const pixelToFeet = 0.1;
  return {
    width: Math.round(boundingBox[2] * pixelToFeet),
    length: Math.round(boundingBox[3] * pixelToFeet)
  };
}

export function extractFeatures(obj: any, textResults: any) {
  const features: string[] = [];
  
  if (obj.tags) {
    features.push(...obj.tags.filter((tag: string) => 
      ['window', 'door', 'sink', 'bathtub', 'shower'].includes(tag)
    ));
  }

  if (textResults?.lines) {
    textResults.lines.forEach((line: any) => {
      if (isWithinBoundingBox(line.boundingBox, obj.boundingBox)) {
        features.push(line.text);
      }
    });
  }

  return features;
}

export function isWithinBoundingBox(innerBox: number[], outerBox: number[]) {
  return (
    innerBox[0] >= outerBox[0] &&
    innerBox[1] >= outerBox[1] &&
    innerBox[0] + innerBox[2] <= outerBox[0] + outerBox[2] &&
    innerBox[1] + innerBox[3] <= outerBox[1] + outerBox[3]
  );
}

export function calculateMaterialEstimates(
  rooms: Room[], 
  customizations: Record<string, any>
): MaterialCategory[] {
  return [
    {
      category: 'Flooring',
      items: rooms.map(room => ({
        name: `${room.type} Flooring`,
        quantity: room.area,
        unit: 'sq ft',
        estimatedCost: room.area * (customizations?.flooringCostPerSqFt || 5)
      }))
    },
    {
      category: 'Paint',
      items: rooms.map(room => {
        const wallArea = (room.dimensions.length * 8 * 2) + (room.dimensions.width * 8 * 2);
        return {
          name: `${room.type} Paint`,
          quantity: wallArea,
          unit: 'sq ft',
          estimatedCost: wallArea * (customizations?.paintCostPerSqFt || 0.5)
        };
      })
    },
    {
      category: 'Electrical',
      items: rooms.map(room => ({
        name: `${room.type} Electrical`,
        quantity: Math.ceil(room.area / 100),
        unit: 'outlets',
        estimatedCost: Math.ceil(room.area / 100) * (customizations?.outletCost || 20)
      }))
    }
  ];
}