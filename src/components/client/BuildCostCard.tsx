import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildCostSummary } from "./build-cost/BuildCostSummary";
import { LineItems } from "./build-cost/LineItems";
import { AIAnalysis } from "./build-cost/AIAnalysis";

interface BuildCostCardProps {
  floorPlanId?: string;
  landListingId?: string;
}

export function BuildCostCard({ floorPlanId, landListingId }: BuildCostCardProps) {
  const { data: buildEstimate, isLoading } = useQuery({
    queryKey: ['build-estimate', floorPlanId, landListingId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('build_cost_estimates')
        .select(`
          *,
          floor_plans (*),
          land_listings (*),
          build_line_items (*)
        `)
        .eq('user_id', session.user.id)
        .eq('floor_plan_id', floorPlanId)
        .eq('land_listing_id', landListingId)
        .maybeSingle();

      if (error) {
        console.error('Build estimate error:', error);
        return null;
      }

      // Set target build cost to 75% of comp value if it exists
      if (data && data.comp_average_price) {
        data.target_build_cost = data.comp_average_price * 0.75;
      }

      return data;
    },
    enabled: !!floorPlanId && !!landListingId
  });

  if (isLoading) return <div>Loading cost breakdown...</div>;
  if (!buildEstimate) return null;

  const floorPlanCost = buildEstimate.floor_plans?.plan_price || 0;
  const consultingFee = buildEstimate.floor_plans?.square_feet ? buildEstimate.floor_plans.square_feet * 5 : 2500;
  const lineItemsTotal = buildEstimate.build_line_items?.reduce(
    (sum, item) => sum + (item.actual_cost || item.estimated_cost || 0),
    0
  ) || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Build Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BuildCostSummary
          floorPlanCost={floorPlanCost}
          consultingFee={consultingFee}
          lineItemsTotal={lineItemsTotal}
          targetCost={buildEstimate.target_build_cost || 0}
          compAveragePrice={buildEstimate.comp_average_price || 0}
        />
        
        <LineItems items={buildEstimate.build_line_items || []} />
        
        <AIAnalysis buildEstimate={buildEstimate} />
      </CardContent>
    </Card>
  );
}