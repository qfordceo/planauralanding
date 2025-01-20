import { processAnalysisResult } from '../analysis.ts';

export function analyzeRooms(azureAnalysis: any) {
  console.log('Starting room analysis');
  
  const analysisResult = processAnalysisResult(azureAnalysis);
  
  return analysisResult;
}