import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { CostSummary } from "./build-cost/CostSummary";
import { RealTimeCosts } from "./build-cost/RealTimeCosts";
import { LineItems } from "./build-cost/LineItems";
import { AIAnalysis } from "./build-cost/AIAnalysis";

interface BuildCostCardProps {
  floorPlanId: string;
  landListingId: string;
  landCost: number;
}

export function BuildCostCard({ floorPlanId, landListingId, landCost }: BuildCostCardProps) {
  const [costs, setCosts] = useState({
    estimated: 0,
    awarded: 0,
    actual: 0
  });

  const { data: buildData, isLoading } = useQuery({
    queryKey: ['build-details', floorPlanId, landListingId],
    queryFn: async () => {
      const [floorPlanResponse, landResponse, lineItemsResponse] = await Promise.all([
        supabase
          .from('floor_plans')
          .select('*')
          .eq('id', floorPlanId)
          .single(),
        supabase
          .from('land_listings')
          .select('*')
          .eq('id', landListingId)
          .single(),
        supabase
          .from('build_line_items')
          .select(`
            *,
            materials:build_materials(*)
          `)
          .eq('build_estimate_id', floorPlanId)
      ]);

      if (floorPlanResponse.error) throw floorPlanResponse.error;
      if (landResponse.error) throw landResponse.error;
      if (lineItemsResponse.error) throw lineItemsResponse.error;

      return {
        floorPlan: floorPlanResponse.data,
        land: landResponse.data,
        lineItems: lineItemsResponse.data
      };
    }
  });

  if (isLoading) {
    return <Progress value={30} className="w-full" />;
  }

  if (!buildData) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load build details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const { floorPlan, lineItems } = buildData;
  const targetBuildCost = (floorPlan.build_price_per_sqft || 0) * floorPlan.square_feet * 0.78;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RealTimeCosts
          buildEstimateId={floorPlanId}
          onCostUpdate={setCosts}
        />

        <CostSummary
          landCost={landCost}
          targetBuildCost={targetBuildCost}
          totalEstimatedCost={costs.estimated}
          totalAwardedCost={costs.awarded}
          totalActualCost={costs.actual}
        />

        <div>
          <h4 className="font-medium mb-4">Cost Breakdown</h4>
          <LineItems items={lineItems} />
        </div>

        <AIAnalysis buildEstimate={{
          floor_plans: floorPlan,
          land_listings: buildData.land,
          line_items: lineItems,
          target_build_cost: targetBuildCost,
          total_estimated_cost: costs.estimated,
          total_awarded_cost: costs.awarded,
          total_actual_cost: costs.actual,
          land_cost: landCost
        }} />
      </CardContent>
    </Card>
  );
}