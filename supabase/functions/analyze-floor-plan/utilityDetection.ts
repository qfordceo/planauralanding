interface UtilityPoint {
  type: string;
  x: number;
  y: number;
  confidence: number;
}

export function detectElectricalLayout(room: any, analysisResult: any): UtilityPoint[] {
  const electricalFeatures = [];
  
  // Detect electrical outlets
  const outlets = analysisResult.objects?.filter(obj => 
    obj.tags?.includes('outlet') || 
    obj.tags?.includes('switch') ||
    obj.tags?.includes('light fixture')
  );

  for (const outlet of outlets || []) {
    if (isWithinBoundingBox(outlet.boundingBox, room.boundingBox)) {
      electricalFeatures.push({
        type: outlet.tags[0],
        x: outlet.boundingBox.x + outlet.boundingBox.w / 2,
        y: outlet.boundingBox.y + outlet.boundingBox.h / 2,
        confidence: outlet.confidence
      });
    }
  }

  // Detect wiring patterns using line detection
  const lines = analysisResult.objects?.filter(obj => 
    obj.tags?.includes('line') && 
    isNearElectricalFeature(obj, electricalFeatures)
  );

  return electricalFeatures;
}

export function detectPlumbingLayout(room: any, analysisResult: any): UtilityPoint[] {
  const plumbingFeatures = [];
  
  // Detect plumbing fixtures
  const fixtures = analysisResult.objects?.filter(obj => 
    obj.tags?.includes('sink') || 
    obj.tags?.includes('toilet') ||
    obj.tags?.includes('shower') ||
    obj.tags?.includes('bathtub') ||
    obj.tags?.includes('water heater')
  );

  for (const fixture of fixtures || []) {
    if (isWithinBoundingBox(fixture.boundingBox, room.boundingBox)) {
      plumbingFeatures.push({
        type: fixture.tags[0],
        x: fixture.boundingBox.x + fixture.boundingBox.w / 2,
        y: fixture.boundingBox.y + fixture.boundingBox.h / 2,
        confidence: fixture.confidence
      });
    }
  }

  // Detect pipe patterns
  const pipes = analysisResult.objects?.filter(obj => 
    obj.tags?.includes('pipe') && 
    isNearPlumbingFeature(obj, plumbingFeatures)
  );

  return plumbingFeatures;
}

function isWithinBoundingBox(innerBox: any, outerBox: any): boolean {
  return (
    innerBox.x >= outerBox.x &&
    innerBox.y >= outerBox.y &&
    innerBox.x + innerBox.w <= outerBox.x + outerBox.w &&
    innerBox.y + innerBox.h <= outerBox.y + outerBox.h
  );
}

function isNearElectricalFeature(obj: any, features: UtilityPoint[]): boolean {
  const maxDistance = 50; // pixels
  const objCenter = {
    x: obj.boundingBox.x + obj.boundingBox.w / 2,
    y: obj.boundingBox.y + obj.boundingBox.h / 2
  };

  return features.some(feature => {
    const distance = Math.sqrt(
      Math.pow(feature.x - objCenter.x, 2) + 
      Math.pow(feature.y - objCenter.y, 2)
    );
    return distance < maxDistance;
  });
}

function isNearPlumbingFeature(obj: any, features: UtilityPoint[]): boolean {
  return isNearElectricalFeature(obj, features); // Same logic, different context
}