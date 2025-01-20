import { processAnalysisResult } from '../analysis';

export function analyzeRooms(azureAnalysis: any) {
  console.log('Starting room analysis');
  
  const analysisResult = processAnalysisResult(azureAnalysis);
  
  return analysisResult;
}