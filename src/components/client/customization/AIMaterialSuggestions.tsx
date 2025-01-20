import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AIMaterialSuggestionsProps {
  suggestions: Array<{
    material_name: string;
    description: string;
    sustainability_score: number;
    cost_impact: number;
    benefits: string[];
  }>;
  isLoading: boolean;
}

export function AIMaterialSuggestions({ suggestions, isLoading }: AIMaterialSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="font-semibold">AI Recommendations Loading...</h3>
        </div>
        <Progress value={30} className="w-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Recommendations</h3>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{suggestion.material_name}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
              <Badge variant={suggestion.cost_impact > 0 ? "destructive" : "success"}>
                {suggestion.cost_impact > 0 ? '+' : ''}{suggestion.cost_impact}% cost
              </Badge>
            </div>

            <Progress 
              value={suggestion.sustainability_score} 
              className="h-2 mb-2"
            />
            <p className="text-xs text-muted-foreground mb-2">
              Sustainability Score: {suggestion.sustainability_score}/100
            </p>

            <div className="flex flex-wrap gap-2">
              {suggestion.benefits.map((benefit, i) => (
                <Badge key={i} variant="secondary">{benefit}</Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}