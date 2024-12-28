import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BuildCostCardProps {
  floorPlanId?: string;
  landListingId?: string;
}

export function BuildCostCard({ floorPlanId, landListingId }: BuildCostCardProps) {
  const { toast } = useToast();
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

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
      return data;
    },
    enabled: !!floorPlanId && !!landListingId
  });

  const getAIAdvice = async () => {
    if (!buildEstimate) return;
    
    setIsLoadingAdvice(true);
    try {
      const response = await supabase.functions.invoke('build-advisor', {
        body: {
          buildEstimate,
          floorPlan: buildEstimate.floor_plans,
          landListing: buildEstimate.land_listings
        }
      });

      if (response.error) throw response.error;
      setAiAdvice(response.data.analysis);
    } catch (error) {
      console.error('Error getting AI advice:', error);
      toast({
        title: "Error",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  if (isLoading) return <div>Loading cost breakdown...</div>;
  if (!buildEstimate) return null;

  const floorPlanCost = buildEstimate.floor_plans?.plan_price || 0;
  const consultingFee = 2500;
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

        <div className="space-y-4">
          <Button
            onClick={getAIAdvice}
            className="w-full"
            disabled={isLoadingAdvice}
          >
            {isLoadingAdvice ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing your build...
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Get AI Build Analysis
              </>
            )}
          </Button>

          {aiAdvice && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-semibold">AI Build Analysis</h3>
              <p className="text-sm whitespace-pre-line">{aiAdvice}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}