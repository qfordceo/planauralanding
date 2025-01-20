import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisStage {
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

interface AnalysisProgressProps {
  isLoading: boolean;
  error: Error | null;
  progress: number;
  stages?: AnalysisStage[];
  onRetry?: () => void;
  metrics?: {
    confidence: number;
    accuracy: number;
    completeness: number;
  };
}

export function AnalysisProgress({ 
  isLoading, 
  error, 
  progress, 
  stages = [],
  onRetry,
  metrics 
}: AnalysisProgressProps) {
  const { toast } = useToast();

  if (!isLoading && !error) return null;

  const handleRetry = () => {
    toast({
      title: "Retrying Analysis",
      description: "Starting a new analysis attempt..."
    });
    onRetry?.();
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          
          {/* Stage Indicators */}
          <div className="grid gap-3">
            {stages.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stage.status === 'complete' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {stage.status === 'processing' && (
                    <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  {stage.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">{stage.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {stage.progress}%
                </span>
              </div>
            ))}
          </div>

          {/* Analysis Quality Metrics */}
          {metrics && (
            <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border p-4">
              <div>
                <div className="text-sm font-medium">Confidence</div>
                <div className="mt-1 text-2xl font-bold">{metrics.confidence}%</div>
              </div>
              <div>
                <div className="text-sm font-medium">Accuracy</div>
                <div className="mt-1 text-2xl font-bold">{metrics.accuracy}%</div>
              </div>
              <div>
                <div className="text-sm font-medium">Completeness</div>
                <div className="mt-1 text-2xl font-bold">{metrics.completeness}%</div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground text-center">
            {progress < 100 ? 'Analyzing floor plan...' : 'Processing results...'}
          </p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error.message}</span>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Analysis
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}