import { calculateRoomDimensions, detectRoomType, calculateMaterialEstimates } from './roomAnalysis.ts';
import { detectElectricalLayout, detectPlumbingLayout } from './utilityDetection.ts';
import { calibrateScale } from './scaleCalibration.ts';

export function processAnalysisResult(azureResult: any) {
  const detectedRooms = [];
  const processedAreas = new Set();
  
  // First calibrate the scale using known reference objects
  const scaleFactor = calibrateScale(azureResult);

  if (azureResult.objects) {
    for (const obj of azureResult.objects) {
      if (obj.tags?.some((tag: string) => 
        ['room', 'bedroom', 'bathroom', 'kitchen', 'living'].includes(tag.toLowerCase()))) {
        
        const dimensions = calculateRoomDimensions(obj.boundingBox, scaleFactor);
        
        const nearbyText = azureResult.readResult?.pages?.[0]?.lines
          ?.filter((line: any) => {
            const lineBox = line.boundingBox;
            return Math.abs(lineBox[0] - obj.boundingBox[0]) < 100 &&
                   Math.abs(lineBox[1] - obj.boundingBox[1]) < 100;
          })
          ?.map((line: any) => line.text)
          ?.join(' ') || '';

        const roomType = detectRoomType(nearbyText, obj.tags);
        
        // Enhanced feature detection
        const electricalLayout = detectElectricalLayout(obj, azureResult);
        const plumbingLayout = detectPlumbingLayout(obj, azureResult);
        
        detectedRooms.push({
          type: roomType,
          dimensions: {
            width: dimensions.width,
            length: dimensions.length
          },
          area: dimensions.area,
          features: obj.tags.filter((tag: string) => 
            ['window', 'door', 'sink', 'bathtub', 'shower', 'closet', 'stairs'].includes(tag)),
          utilities: {
            electrical: electricalLayout,
            plumbing: plumbingLayout
          }
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
    },
    utilities: {
      electrical: detectedRooms.map(room => room.utilities.electrical),
      plumbing: detectedRooms.map(room => room.utilities.plumbing)
    },
    scaleFactor
  };
}