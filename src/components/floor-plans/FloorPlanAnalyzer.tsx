import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FloorPlanAnalysisResults } from './FloorPlanAnalysisResults';
import type { AnalysisResult } from '@/types/floor-plans';

interface FloorPlanAnalyzerProps {
  imageUrl: string;
}

export function FloorPlanAnalyzer({ imageUrl }: FloorPlanAnalyzerProps) {
  const { toast } = useToast();
  const [customizations, setCustomizations] = useState({
    flooringCostPerSqFt: 5,
    paintCostPerSqFt: 0.5
  });

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['floor-plan-analysis', imageUrl, customizations],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('analyze-floor-plan', {
          body: { imageUrl, customizations }
        });

        if (response.error) throw response.error;
        return response.data as AnalysisResult;
      } catch (error) {
        console.error('Error analyzing floor plan:', error);
        toast({
          title: "Error",
          description: "Failed to analyze floor plan. Please check the image and try again.",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!imageUrl,
    retry: 1
  });

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Floor Plan Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Error analyzing floor plan. Please try again with a different image.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Floor Plan Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Analyzing floor plan...</div>
        ) : analysis ? (
          <FloorPlanAnalysisResults
            analysis={analysis}
            customizations={customizations}
            onCustomizationChange={setCustomizations}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}