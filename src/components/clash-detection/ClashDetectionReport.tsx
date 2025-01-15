import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClashDetectionReportProps {
  modelId: string;
}

export function ClashDetectionReport({ modelId }: ClashDetectionReportProps) {
  const { data: clashReport, isLoading, error } = useQuery({
    queryKey: ['clash-detection', modelId],
    queryFn: async () => {
      const { data: modelData } = await supabase
        .from('bim_models')
        .select('model_data')
        .eq('id', modelId)
        .single();

      if (!modelData) throw new Error('Model not found');

      const response = await supabase.functions.invoke('detect-clashes', {
        body: { modelData: modelData.model_data }
      });

      if (response.error) throw response.error;
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to analyze model for clashes. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Clash Detection Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clashReport?.analysis_results && (
          <div className="space-y-4">
            {clashReport.analysis_results.split('\n').map((line, index) => (
              <div key={index} className="flex items-start gap-2">
                {line.toLowerCase().includes('clash') ? (
                  <AlertTriangle className="h-4 w-4 mt-1 text-yellow-500 shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                )}
                <p className="text-sm">{line}</p>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => window.print()}>
            Export Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}