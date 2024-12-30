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
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeFloorPlan = async () => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke('analyze-floor-plan', {
        body: { imageUrl, customizations }
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (error) {
      console.error('Error analyzing floor plan:', error);
      toast({
        title: "Error",
        description: "Failed to analyze floor plan",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['floor-plan-analysis', imageUrl, customizations],
    queryFn: analyzeFloorPlan,
    enabled: !!imageUrl && isAnalyzing
  });

  const handleAnalyze = (url: string) => {
    setImageUrl(url);
    setIsAnalyzing(true);
  };

  const handleCustomizationChange = (updates: Partial<CustomizationOptions>) => {
    setCustomizations(prev => ({ ...prev, ...updates }));
  };

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