import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloorPlanCard } from "@/components/floor-plans/FloorPlanCard";
import { useToast } from "@/hooks/use-toast";

export function SavedFloorPlans() {
  const { toast } = useToast();
  
  const { data: savedBuilds, isLoading } = useQuery({
    queryKey: ['saved-builds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_builds')
        .select(`
          *,
          floor_plans (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handlePurchase = async (floorPlanId: string) => {
    toast({
      title: "Coming Soon",
      description: "Purchase functionality will be available soon!",
    });
  };

  if (isLoading) return <div>Loading saved floor plans...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedBuilds?.map((build) => (
          <Card key={build.id} className="relative">
            <FloorPlanCard plan={build.floor_plans} />
            <CardContent className="pt-4">
              <Button 
                className="w-full" 
                onClick={() => handlePurchase(build.floor_plans.id)}
              >
                Purchase Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}