import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FloorPlanAnalysisResults } from "./FloorPlanAnalysisResults";
import { AnalysisProgress } from "./analysis/AnalysisProgress";
import { AnalysisForm } from "./analysis/AnalysisForm";
import { useAnalysis } from "./analysis/useAnalysis";
import type { CustomizationOptions } from "@/types/floor-plans";

interface FloorPlanAnalyzerProps {
  imageUrl?: string;
}

export function FloorPlanAnalyzer({ imageUrl: initialImageUrl }: FloorPlanAnalyzerProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
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

  const { 
    data: analysis, 
    isLoading, 
    error, 
    refetch,
    stages,
    metrics 
  } = useAnalysis(imageUrl, customizations);

  const handleAnalyze = (url: string) => {
    setImageUrl(url);
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <AnalysisForm 
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        <AnalysisProgress 
          isLoading={isLoading}
          error={error as Error | null}
          stages={stages}
          onRetry={refetch}
          metrics={metrics}
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