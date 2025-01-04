import { FloorPlanCard } from "@/components/floor-plans/FloorPlanCard";
import { Loader2 } from "lucide-react";

interface FloorPlanGridProps {
  floorPlans: any[];
  selectedPlan: string | null;
  onSelectPlan: (id: string) => void;
  isLoading: boolean;
}

export function FloorPlanGrid({ 
  floorPlans, 
  selectedPlan, 
  onSelectPlan,
  isLoading 
}: FloorPlanGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {floorPlans?.map((plan) => (
        <div
          key={plan.id}
          onClick={() => onSelectPlan(plan.id)}
          className={`cursor-pointer transition-all ${
            selectedPlan === plan.id ? "ring-2 ring-primary" : ""
          }`}
        >
          <FloorPlanCard plan={plan} />
        </div>
      ))}
    </div>
  );
}