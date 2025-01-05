import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealTimeCosts } from "./RealTimeCosts";
import { CostSummary } from "./CostSummary";

interface CostOverviewProps {
  floorPlanId: string;
  landCost: number;
  targetBuildCost: number;
  onCostUpdate: (costs: {
    estimated: number;
    awarded: number;
    actual: number;
  }) => void;
}

export function CostOverview({ 
  floorPlanId, 
  landCost, 
  targetBuildCost,
  onCostUpdate 
}: CostOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RealTimeCosts
          buildEstimateId={floorPlanId}
          onCostUpdate={onCostUpdate}
        />

        <CostSummary
          landCost={landCost}
          targetBuildCost={targetBuildCost}
          totalEstimatedCost={costs.estimated}
          totalAwardedCost={costs.awarded}
          totalActualCost={costs.actual}
        />
      </CardContent>
    </Card>
  );
}