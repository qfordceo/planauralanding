import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult, CustomizationOptions } from "@/types/floor-plans";

interface AnalysisStage {
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

interface AnalysisMetrics {
  confidence: number;
  accuracy: number;
  completeness: number;
}

export function useAnalysis(imageUrl: string | null, customizations: CustomizationOptions) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['floor-plan-analysis', imageUrl, customizations],
    queryFn: async (): Promise<AnalysisResult> => {
      if (!imageUrl) throw new Error('No image URL provided');

      const { data, error } = await supabase.functions.invoke('analyze-floor-plan', {
        body: { imageUrl, customizations }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!imageUrl,
  });

  // Simulated stages for demo - in production, these would come from the backend
  const stages: AnalysisStage[] = [
    { name: 'Image Processing', progress: 100, status: 'complete' },
    { name: 'Room Detection', progress: 80, status: 'processing' },
    { name: 'Feature Analysis', progress: 30, status: 'processing' },
    { name: 'Cost Estimation', progress: 0, status: 'pending' }
  ];

  // Simulated metrics - in production, these would come from the backend
  const metrics: AnalysisMetrics = {
    confidence: 85,
    accuracy: 92,
    completeness: 78
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    stages,
    metrics
  };
}