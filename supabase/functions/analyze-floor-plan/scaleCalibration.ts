interface ReferenceObject {
  type: string;
  standardSize: number; // in feet
}

const REFERENCE_OBJECTS: ReferenceObject[] = [
  { type: 'door', standardSize: 3 }, // Standard door width
  { type: 'window', standardSize: 3 }, // Standard window width
  { type: 'bathtub', standardSize: 5 }, // Standard bathtub length
  { type: 'counter', standardSize: 2 }, // Standard counter depth
];

export function calibrateScale(analysisResult: any): number {
  let scaleFactor = 0;
  let confidenceScore = 0;

  // Find reference objects in the image
  for (const obj of analysisResult.objects || []) {
    const referenceObj = REFERENCE_OBJECTS.find(ref => 
      obj.tags?.includes(ref.type)
    );

    if (referenceObj) {
      // Calculate pixels per foot using this reference
      const pixelsPerFoot = obj.boundingBox.w / referenceObj.standardSize;
      
      // Weight the contribution based on confidence
      const weight = obj.confidence || 0.5;
      scaleFactor += pixelsPerFoot * weight;
      confidenceScore += weight;
    }
  }

  // Return average scale factor, or default if no reference objects found
  return confidenceScore > 0 ? scaleFactor / confidenceScore : 0.1; // Default 1 foot = 10 pixels
}