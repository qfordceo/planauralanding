import { MATERIAL_OPTIONS, STANDARD_WALL_HEIGHT } from './constants.ts';
import type { Room, MaterialEstimate } from './types.ts';

export function calculateMaterialEstimates(rooms: Room[]): MaterialEstimate[] {
  return rooms.map(room => {
    const wallArea = ((room.dimensions.width + room.dimensions.length) * 2) * STANDARD_WALL_HEIGHT;
    
    return {
      name: room.type,
      flooring: {
        area: room.area,
        estimates: MATERIAL_OPTIONS.flooring.map(option => ({
          type: option.name,
          cost: room.area * option.costPerSqFt
        }))
      },
      paint: {
        area: wallArea,
        estimates: MATERIAL_OPTIONS.paint.map(option => ({
          type: option.name,
          cost: wallArea * option.costPerSqFt
        }))
      }
    };
  });
}