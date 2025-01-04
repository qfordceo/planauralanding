import { Button } from "@/components/ui/button";

interface FloorPlanFooterProps {
  onNext: () => void;
  onBack: () => void;
  selectedPlan: string | null;
}

export function FloorPlanFooter({ onNext, onBack, selectedPlan }: FloorPlanFooterProps) {
  return (
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
  );
}