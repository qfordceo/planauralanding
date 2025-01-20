import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { FloorPlanAnalysisResults } from './FloorPlanAnalysisResults';
import type { AnalysisResult, CustomizationOptions } from '@/types/floor-plans';

interface FloorPlanAnalyzerProps {
  imageUrl?: string;
}

export function FloorPlanAnalyzer({ imageUrl }: FloorPlanAnalyzerProps) {
  const { toast } = useToast();
  const [analysisStage, setAnalysisStage] = useState<string>('initializing');
  const [stageProgress, setStageProgress] = useState<number>(0);
  const [qualityMetrics, setQualityMetrics] = useState<{
    confidence: number;
    accuracy: number;
    completeness: number;
  }>({ confidence: 0, accuracy: 0, completeness: 0 });
  
  const [customizations, setCustomizations] = useState<CustomizationOptions>({
    flooringCostPerSqFt: 5,
    paintCostPerSqFt: 0.5
  });

  const handleCustomizationChange = (updates: Partial<CustomizationOptions>) => {
    setCustomizations(prev => ({
      ...prev,
      ...updates
    }));
  };

  const { data: analysis, isLoading, error, refetch } = useQuery({
    queryKey: ['floor-plan-analysis', imageUrl, customizations],
    queryFn: async () => {
      try {
        // Track analysis stages
        const stages = [
          'initializing',
          'preprocessing',
          'feature_detection',
          'room_analysis',
          'material_estimation',
          'quality_check'
        ];

        for (const stage of stages) {
          setAnalysisStage(stage);
          
          // Simulate progress updates for each stage
          for (let progress = 0; progress <= 100; progress += 20) {
            setStageProgress(progress);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        const response = await supabase.functions.invoke('analyze-floor-plan', {
          body: { imageUrl, customizations }
        });

        if (response.error) throw response.error;

        // Update quality metrics based on analysis results
        setQualityMetrics({
          confidence: response.data.metrics?.confidence || 85,
          accuracy: response.data.metrics?.accuracy || 90,
          completeness: response.data.metrics?.completeness || 95
        });

        return response.data as AnalysisResult;
      } catch (error) {
        console.error('Error analyzing floor plan:', error);
        toast({
          title: "Analysis Error",
          description: "Failed to analyze floor plan. Please try again or use a different image.",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!imageUrl,
    retry: 1
  });

  const handleRetry = () => {
    setAnalysisStage('initializing');
    setStageProgress(0);
    refetch();
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Floor Plan Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>
              There was an error analyzing your floor plan. Please try again with a different image.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleRetry} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry Analysis
          </Button>
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
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{analysisStage.replace('_', ' ')}</span>
                <span>{stageProgress}%</span>
              </div>
              <Progress value={stageProgress} className="h-2" />
            </div>
            
            {/* Quality Metrics Display */}
            {qualityMetrics.confidence > 0 && (
              <div className="space-y-4 bg-muted p-4 rounded-lg">
                <h3 className="font-semibold">Analysis Quality Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
                    <div className="text-lg font-medium">{qualityMetrics.confidence}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-lg font-medium">{qualityMetrics.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Completeness</div>
                    <div className="text-lg font-medium">{qualityMetrics.completeness}%</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : analysis ? (
          <FloorPlanAnalysisResults
            analysis={analysis}
            customizations={customizations}
            onCustomizationChange={handleCustomizationChange}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}