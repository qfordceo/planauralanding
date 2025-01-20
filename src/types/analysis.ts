export interface AnalysisStage {
  name: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  weight: number;
  progress: number;
}

export interface AnalysisMetrics {
  confidence: number;
  accuracy: number;
  completeness: number;
}