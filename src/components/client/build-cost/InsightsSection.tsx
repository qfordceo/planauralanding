import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineComparison } from "@/components/timeline/monitoring/TimelineComparison";
import { AIAnalysis } from "./AIAnalysis";

interface InsightsSectionProps {
  projectId: string;
  buildEstimate: {
    floor_plans: any;
    land_listings: any;
    line_items: any[];
    target_build_cost: number;
    total_estimated_cost: number;
    total_awarded_cost: number;
    total_actual_cost: number;
    land_cost: number;
  };
}

export function InsightsSection({ projectId, buildEstimate }: InsightsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TimelineComparison projectId={projectId} />
      
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <AIAnalysis buildEstimate={buildEstimate} />
        </CardContent>
      </Card>
    </div>
  );
}