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
    <div className="space-y-4">
      {isLoading && (
        <Progress value={progress} className="w-full" />
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