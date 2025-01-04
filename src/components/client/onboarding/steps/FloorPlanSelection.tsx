import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FloorPlanHeader } from "./floor-plan/FloorPlanHeader";
import { FloorPlanGrid } from "./floor-plan/FloorPlanGrid";
import { FloorPlanFooter } from "./floor-plan/FloorPlanFooter";

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
      <FloorPlanHeader />
      
      <FloorPlanGrid
        floorPlans={floorPlans || []}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        isLoading={isLoading}
      />

      <FloorPlanFooter 
        onNext={onNext}
        onBack={onBack}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}