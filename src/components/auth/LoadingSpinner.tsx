import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="container max-w-lg mx-auto py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
}