import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { useContractorAdvisor } from "@/hooks/use-contractor-advisor";
import { Loader2, Sparkles } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick: () => void;
  children?: ReactNode;
  expanded?: boolean;
  badge?: {
    count: number;
    variant: "default" | "destructive" | "warning";
  };
  visibility?: "public" | "private";
  aiData?: any;
  aiSection?: string;
}

export function DashboardCard({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  onClick,
  children,
  expanded = false,
  badge,
  visibility,
  aiData,
  aiSection
}: DashboardCardProps) {
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
    <Card className={expanded ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
          <div className="ml-auto flex items-center gap-2">
            {visibility && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                visibility === "public" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {visibility === "public" ? "Public" : "Private"}
              </span>
            )}
            {badge && (
              <span className={`px-2 py-1 text-xs rounded-full bg-${badge.variant} text-${badge.variant}-foreground`}>
                {badge.count}
              </span>
            )}
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!expanded && (
          <>
            <p className="text-muted-foreground mb-4">
              {description}
            </p>
            <Button onClick={onClick}>{buttonText}</Button>
          </>
        )}
        {expanded && children}
        {aiInsights && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">AI Insights</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {aiInsights}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}