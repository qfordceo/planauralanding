import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useContractorAdvisor } from "@/hooks/use-contractor-advisor";

interface AIInsightsProps {
  aiData?: any;
  aiSection?: string;
}

export function AIInsights({ aiData, aiSection }: AIInsightsProps) {
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const { getAdvice, isLoading } = useContractorAdvisor();

  const handleGetInsights = async () => {
    if (!aiData || !aiSection) return;
    const insights = await getAdvice(aiSection, aiData);
    if (insights) {
      setAiInsights(insights);
    }
  };

  return (
    <>
      {aiData && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGetInsights}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </Button>
      )}
      {aiInsights && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">AI Insights</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {aiInsights}
          </p>
        </div>
      )}
    </>
  );
}