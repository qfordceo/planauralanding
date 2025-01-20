import { analyzeImageWithAzure } from '../utils';

export async function detectFeatures(imageData: ArrayBuffer) {
  console.log('Starting feature detection');
  
  const azureAnalysis = await analyzeImageWithAzure(imageData);
  
  return azureAnalysis;
}