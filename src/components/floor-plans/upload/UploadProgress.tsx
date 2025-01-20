import { AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadProgressProps {
  isLoading: boolean;
  progress: number;
  error: string | null;
}

export function UploadProgress({ isLoading, progress, error }: UploadProgressProps) {
  if (!isLoading && !error) return null;
  
  return (
    <div className="space-y-4 mt-4">
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">
            {progress < 100 ? 'Uploading files...' : 'Processing uploads...'}
          </p>
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}