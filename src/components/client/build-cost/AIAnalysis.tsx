import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AIAnalysisProps {
  buildEstimate: any;
}

export function AIAnalysis({ buildEstimate }: AIAnalysisProps) {
  const { toast } = useToast();
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const getAIAdvice = async () => {
    if (!buildEstimate) return;
    
    setIsLoadingAdvice(true);
    try {
      const response = await supabase.functions.invoke('build-advisor', {
        body: {
          buildEstimate,
          floorPlan: buildEstimate.floor_plans,
          landListing: buildEstimate.land_listings
        }
      });

      if (response.error) throw response.error;
      setAiAdvice(response.data.analysis);
    } catch (error) {
      console.error('Error getting AI advice:', error);
      toast({
        title: "Error",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={getAIAdvice}
        className="w-full"
        disabled={isLoadingAdvice}
      >
        {isLoadingAdvice ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing your build...
          </>
        ) : (
          <>
            <MessageSquare className="mr-2 h-4 w-4" />
            Get AI Build Analysis
          </>
        )}
      </Button>

      {aiAdvice && (
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h3 className="font-semibold">AI Build Analysis</h3>
          <p className="text-sm whitespace-pre-line">{aiAdvice}</p>
        </div>
      )}
    </div>
  );
}
