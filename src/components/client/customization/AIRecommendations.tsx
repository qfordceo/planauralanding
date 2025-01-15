import { Loader2 } from "lucide-react";

interface AIRecommendationsProps {
  isLoading: boolean;
  recommendations?: string;
}

export function AIRecommendations({ isLoading, recommendations }: AIRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!recommendations) return null;

  return (
    <div className="space-y-2 p-4 bg-muted rounded-lg">
      <h3 className="font-semibold">AI Recommendations</h3>
      <p className="text-sm whitespace-pre-line">{recommendations}</p>
    </div>
  );
}