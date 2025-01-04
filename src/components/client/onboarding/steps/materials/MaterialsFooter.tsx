import { Button } from "@/components/ui/button";

interface MaterialsFooterProps {
  onNext: () => void;
  onBack: () => void;
  materialsSelected: boolean;
}

export function MaterialsFooter({ onNext, onBack, materialsSelected }: MaterialsFooterProps) {
  return (
    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={onBack}>
        Back to Floor Plans
      </Button>
      <Button 
        onClick={onNext}
        disabled={!materialsSelected}
      >
        Continue to Contractor Selection
      </Button>
    </div>
  );
}