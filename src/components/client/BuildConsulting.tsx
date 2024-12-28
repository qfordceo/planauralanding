import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BuildConsultingProps {
  profile: any;
  floorPlanId?: string;
}

export function BuildConsulting({ profile, floorPlanId }: BuildConsultingProps) {
  const { data: floorPlan } = useQuery({
    queryKey: ['floor-plan', floorPlanId],
    queryFn: async () => {
      if (!floorPlanId) return null;
      
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .eq('id', floorPlanId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!floorPlanId
  });

  const calculateConsultingFee = (squareFeet: number) => {
    const feePerSqFt = 5; // $5 per square foot
    return squareFeet * feePerSqFt;
  };

  const squareFeet = floorPlan?.square_feet || 1875; // Use example if no floor plan selected
  const consultingFee = calculateConsultingFee(squareFeet);

  const handlePayment = () => {
    // Will be implemented when payment API is ready
    console.log("Processing payment");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Consulting Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg">
            Our build consulting service includes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Personalized design consultation</li>
            <li>Material selection guidance</li>
            <li>Construction timeline planning</li>
            <li>Budget optimization</li>
            <li>Contractor coordination</li>
          </ul>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="font-semibold">Consulting Fee Calculation:</p>
            <div className="text-sm space-y-1">
              <p>Square Footage: {squareFeet.toLocaleString()} sq ft</p>
              <p>Rate: $5 per square foot</p>
              <p className="font-medium text-base mt-2">
                Total Consulting Fee: {formatPrice(consultingFee)}
              </p>
            </div>
          </div>
          <Button onClick={handlePayment} className="w-full">
            Get Started with Build Consulting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}