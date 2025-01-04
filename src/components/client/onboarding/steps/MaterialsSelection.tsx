import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MaterialsCard } from "@/components/client/MaterialsCard";

interface MaterialsSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function MaterialsSelection({ onNext, onBack }: MaterialsSelectionProps) {
  const [materialsSelected, setMaterialsSelected] = useState(false);

  const handleSelectionComplete = () => {
    setMaterialsSelected(true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Select Your Materials
        </h3>
        <p className="text-muted-foreground">
          Choose the materials for your build
        </p>
      </div>

      <MaterialsCard 
        floorPlanId="placeholder-id" 
        onSelectionComplete={handleSelectionComplete}
      />

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
    </div>
  );
}