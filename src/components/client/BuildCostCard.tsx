import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { CostOverview } from "./build-cost/CostOverview";
import { DetailedAnalysis } from "./build-cost/DetailedAnalysis";
import { InsightsSection } from "./build-cost/InsightsSection";

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
      const [floorPlanResponse, landResponse, lineItemsResponse, milestonesResponse] = await Promise.all([
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
          .eq('build_estimate_id', floorPlanId),
        supabase
          .from('project_milestones')
          .select('*')
          .eq('build_estimate_id', floorPlanId)
      ]);

      if (floorPlanResponse.error) throw floorPlanResponse.error;
      if (landResponse.error) throw landResponse.error;
      if (lineItemsResponse.error) throw lineItemsResponse.error;
      if (milestonesResponse.error) throw milestonesResponse.error;

      return {
        floorPlan: floorPlanResponse.data,
        land: landResponse.data,
        lineItems: lineItemsResponse.data,
        milestones: milestonesResponse.data
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

  const { floorPlan, lineItems, milestones } = buildData;
  const targetBuildCost = (floorPlan.build_price_per_sqft || 0) * floorPlan.square_feet * 0.78;

  return (
    <div className="space-y-6">
      <CostOverview
        floorPlanId={floorPlanId}
        landCost={landCost}
        targetBuildCost={targetBuildCost}
        onCostUpdate={setCosts}
      />

      <DetailedAnalysis
        lineItems={lineItems}
        milestones={milestones}
        completionDate={buildData.floorPlan.completion_date}
      />

      <InsightsSection
        projectId={floorPlanId}
        buildEstimate={{
          floor_plans: floorPlan,
          land_listings: buildData.land,
          line_items: lineItems,
          target_build_cost: targetBuildCost,
          total_estimated_cost: costs.estimated,
          total_awarded_cost: costs.awarded,
          total_actual_cost: costs.actual,
          land_cost: landCost
        }}
      />
    </div>
  );
}