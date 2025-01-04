import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FloorPlanCard } from "@/components/floor-plans/FloorPlanCard";
import { Loader2 } from "lucide-react";

interface FloorPlanSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function FloorPlanSelection({ onNext, onBack }: FloorPlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: floorPlans, isLoading } = useQuery({
    queryKey: ['floor-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Choose Your Floor Plan
        </h3>
        <p className="text-muted-foreground">
          Select a floor plan that matches your vision
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {floorPlans?.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <FloorPlanCard plan={plan} />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Land Selection
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedPlan}
        >
          Continue to Materials
        </Button>
      </div>
    </div>
  );
}