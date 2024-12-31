import { calculateRoomDimensions, detectRoomType, calculateMaterialEstimates } from './roomAnalysis.ts';

export function processAnalysisResult(azureResult: any) {
  const detectedRooms = [];
  const processedAreas = new Set();

  if (azureResult.objects) {
    for (const obj of azureResult.objects) {
      if (obj.tags?.some((tag: string) => 
        ['room', 'bedroom', 'bathroom', 'kitchen', 'living'].includes(tag.toLowerCase()))) {
        
        const dimensions = calculateRoomDimensions(obj.boundingBox);
        
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

  const materialEstimates = calculateMaterialEstimates(detectedRooms);

  return {
    rooms: detectedRooms,
    totalArea: materialEstimates.totalArea,
    materialEstimates: materialEstimates.rooms,
    customizationOptions: {
      flooring: materialEstimates.flooringOptions,
      paint: materialEstimates.paintOptions
    }
  };
}