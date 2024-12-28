import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

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
      return data;
    },
    enabled: !!floorPlanId && !!landListingId
  });

  if (isLoading) return <div>Loading cost breakdown...</div>;
  if (!buildEstimate) return null;

  const floorPlanCost = buildEstimate.floor_plans?.plan_price || 0;
  const consultingFee = 2500; // Plan Aura's flat consulting fee
  const lineItemsTotal = buildEstimate.build_line_items?.reduce(
    (sum, item) => sum + (item.actual_cost || item.estimated_cost || 0),
    0
  ) || 0;

  const totalCost = floorPlanCost + consultingFee + lineItemsTotal;
  const targetCost = buildEstimate.target_build_cost || 0;
  const equity = buildEstimate.comp_average_price 
    ? buildEstimate.comp_average_price - totalCost 
    : 0;
  const equityPercentage = buildEstimate.comp_average_price 
    ? (equity / buildEstimate.comp_average_price) * 100 
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Build Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Floor Plan Cost</span>
            <span>{formatPrice(floorPlanCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Plan Aura Consulting Fee</span>
            <span>{formatPrice(consultingFee)}</span>
          </div>
          {buildEstimate.build_line_items?.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.description}</span>
              <span>{formatPrice(item.actual_cost || item.estimated_cost || 0)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-bold flex justify-between">
            <span>Total Cost</span>
            <span>{formatPrice(totalCost)}</span>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Target Build Cost</span>
            <span>{formatPrice(targetCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Comparable Home Value</span>
            <span>{formatPrice(buildEstimate.comp_average_price || 0)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Potential Equity</span>
            <span>{formatPrice(equity)} ({equityPercentage.toFixed(1)}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}