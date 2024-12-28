import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineItems } from "./build-cost/LineItems";
import { AIAnalysis } from "./build-cost/AIAnalysis";
import { formatPrice } from "@/lib/utils";

interface BuildCostCardProps {
  floorPlanId: string;
  landListingId: string;
  landCost: number;
}

export function BuildCostCard({ floorPlanId, landListingId, landCost }: BuildCostCardProps) {
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
  const totalEstimatedCost = lineItems.reduce((sum, item) => sum + (item.estimated_cost || 0), 0);
  const totalAwardedCost = lineItems.reduce((sum, item) => sum + (item.awarded_cost || 0), 0);
  const totalActualCost = lineItems.reduce((sum, item) => sum + (item.actual_cost || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Cost Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Cost Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Land Cost</span>
                <span>{formatPrice(landCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Build Cost</span>
                <span>{formatPrice(targetBuildCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Estimated</span>
                <span>{formatPrice(totalEstimatedCost)}</span>
              </div>
              {totalAwardedCost > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Total Awarded</span>
                  <span>{formatPrice(totalAwardedCost)}</span>
                </div>
              )}
              {totalActualCost > 0 && (
                <div className="flex justify-between font-medium">
                  <span>Total Actual</span>
                  <span>{formatPrice(totalActualCost)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Progress</h4>
            <Progress 
              value={(totalActualCost / targetBuildCost) * 100} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round((totalActualCost / targetBuildCost) * 100)}% of target budget used
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Cost Breakdown</h4>
          <LineItems items={lineItems} />
        </div>

        <AIAnalysis buildEstimate={{
          floor_plans: floorPlan,
          land_listings: buildData.land,
          line_items: lineItems,
          target_build_cost: targetBuildCost,
          total_estimated_cost: totalEstimatedCost,
          total_awarded_cost: totalAwardedCost,
          total_actual_cost: totalActualCost,
          land_cost: landCost
        }} />
      </CardContent>
    </Card>
  );
}