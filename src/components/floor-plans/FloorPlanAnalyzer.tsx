import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FloorPlanAnalysisForm } from './FloorPlanAnalysisForm';
import { FloorPlanAnalysisResults } from './FloorPlanAnalysisResults';
import type { AnalysisResult, CustomizationOptions } from '@/types/floor-plans';

export function FloorPlanAnalyzer() {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [customizations, setCustomizations] = useState<CustomizationOptions>({
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
          description: "Failed to analyze floor plan. Please check the image URL and try again.",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!imageUrl,
    retry: 1
  });

  const handleAnalyze = (url: string) => {
    setImageUrl(url);
  };

  const handleCustomizationChange = (updates: Partial<CustomizationOptions>) => {
    setCustomizations(prev => ({ ...prev, ...updates }));
  };

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
          <FloorPlanAnalysisForm 
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
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
        <FloorPlanAnalysisForm 
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />
        
        {analysis && (
          <FloorPlanAnalysisResults
            analysis={analysis}
            customizations={customizations}
            onCustomizationChange={handleCustomizationChange}
          />
        )}
      </CardContent>
    </Card>
  );
}