import { formatPrice } from "@/lib/utils";
import { MaterialCategory } from "./types";

interface MaterialsCostSummaryProps {
  materialCategories: MaterialCategory[];
}

export function MaterialsCostSummary({ materialCategories }: MaterialsCostSummaryProps) {
  const getTotalEstimatedCost = () => {
    return materialCategories.reduce((total, category) => 
      total + category.estimatedCost, 0
    );
  };

  const getTotalSelectedCost = () => {
    return materialCategories.reduce((total, category) => 
      total + category.items.reduce((categoryTotal, item) => 
        categoryTotal + (item.selectedProduct?.price || 0) * item.quantity, 0
      ), 0
    );
  };

  return (
    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
      <div>
        <p className="text-sm font-medium">Estimated Total Cost</p>
        <p className="text-2xl font-bold">{formatPrice(getTotalEstimatedCost())}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">Selected Materials Cost</p>
        <p className="text-2xl font-bold text-primary">{formatPrice(getTotalSelectedCost())}</p>
      </div>
    </div>
  );
}