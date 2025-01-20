import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AnalysisProgressProps {
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

export function AnalysisProgress({ isLoading, error, progress }: AnalysisProgressProps) {
  if (!isLoading && !error) return null;

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {progress < 100 ? 'Analyzing floor plan...' : 'Processing results...'}
          </p>
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}