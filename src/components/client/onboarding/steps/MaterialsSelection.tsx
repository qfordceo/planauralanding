import { useState } from "react";
import { MaterialsCard } from "@/components/client/MaterialsCard";
import { MaterialsHeader } from "./materials/MaterialsHeader";
import { MaterialsFooter } from "./materials/MaterialsFooter";

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
      <MaterialsHeader />
      
      <MaterialsCard 
        floorPlanId="placeholder-id" 
        onSelectionComplete={handleSelectionComplete}
      />

      <MaterialsFooter 
        onNext={onNext}
        onBack={onBack}
        materialsSelected={materialsSelected}
      />
    </div>
  );
}