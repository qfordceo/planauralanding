import { PIXELS_TO_FEET_RATIO, ROOM_TYPES, STANDARD_WALL_HEIGHT } from './constants.ts';
import type { Room, RoomDimensions } from './types.ts';

export function calculateDimensions(boundingBox: { w: number; h: number }): RoomDimensions {
  return {
    width: Math.round(boundingBox.w * PIXELS_TO_FEET_RATIO),
    length: Math.round(boundingBox.h * PIXELS_TO_FEET_RATIO),
    area: Math.round(boundingBox.w * boundingBox.h * Math.pow(PIXELS_TO_FEET_RATIO, 2))
  };
}

export function detectRoomType(text: string, tags: string[]): string {
  const lowerText = text.toLowerCase();
  
  for (const [type, keywords] of Object.entries(ROOM_TYPES)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }

  // Fallback to feature-based detection
  if (tags.includes('sink') && tags.includes('shower')) return 'bathroom';
  if (tags.includes('sink') && !tags.includes('shower')) return 'kitchen';
  if (tags.includes('window') && tags.length === 1) return 'living';
  
  return 'room';
}

export function extractFeatures(obj: any, textResults: any): string[] {
  const features = new Set<string>();
  
  if (obj.tags) {
    const relevantTags = ['window', 'door', 'sink', 'bathtub', 'shower', 'closet'];
    obj.tags.forEach((tag: string) => {
      if (relevantTags.includes(tag.toLowerCase())) {
        features.add(tag.toLowerCase());
      }
    });
  }

  // Extract features from nearby text
  if (textResults?.lines) {
    textResults.lines.forEach((line: any) => {
      const featureKeywords = ['window', 'door', 'sink', 'bath', 'shower', 'closet'];
      const text = line.text.toLowerCase();
      featureKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          features.add(keyword);
        }
      });
    });
  }

  return Array.from(features);
}