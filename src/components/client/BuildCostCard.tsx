import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildCostSummary } from "./build-cost/BuildCostSummary";
import { LineItems } from "./build-cost/LineItems";
import { AIAnalysis } from "./build-cost/AIAnalysis";
import { Building } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";

interface BuildCostCardProps {
  floorPlanId?: string;
  landListingId?: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export function BuildCostCard({ 
  floorPlanId, 
  landListingId, 
  expanded = false,
  onToggle 
}: BuildCostCardProps) {
  const { data: buildEstimate, isLoading } = useQuery({
    queryKey: ['build-estimate', floorPlanId, landListingId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const [buildEstimate, landListing] = await Promise.all([
        supabase
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
          .maybeSingle(),
        supabase
          .from('land_listings')
          .select('*')
          .eq('id', landListingId)
          .maybeSingle()
      ]);

      if (buildEstimate.error) {
        console.error('Build estimate error:', buildEstimate.error);
        return null;
      }

      const data = buildEstimate.data;
      if (data && data.comp_average_price) {
        // Set target build cost to 78% of comp value
        data.target_build_cost = data.comp_average_price * 0.78;
        data.land_cost = landListing.data?.price || 0;
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
  const landCost = buildEstimate.land_cost || 0;

  return (
    <DashboardCard
      title="Build Cost Breakdown"
      description="View your complete build cost analysis including land, materials, and labor"
      icon={Building}
      buttonText={expanded ? 'Close Cost Breakdown' : 'View Cost Breakdown'}
      onClick={onToggle}
      expanded={expanded}
    >
      <div className="space-y-4">
        <BuildCostSummary
          floorPlanCost={floorPlanCost}
          consultingFee={consultingFee}
          lineItemsTotal={lineItemsTotal}
          targetCost={buildEstimate.target_build_cost || 0}
          compAveragePrice={buildEstimate.comp_average_price || 0}
          landCost={landCost}
        />
        
        <LineItems items={buildEstimate.build_line_items || []} />
        
        <AIAnalysis buildEstimate={buildEstimate} />
      </div>
    </DashboardCard>
  );
}