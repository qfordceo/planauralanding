import { formatPrice } from "@/lib/utils";
import { MaterialsCostSummaryProps } from "./types";

export function MaterialsCostSummary({ materialCategories }: MaterialsCostSummaryProps) {
  const getTotalEstimatedCost = () => {
    return materialCategories.reduce((total, category) => 
      total + category.estimatedCost, 0
    );
  };

  return (
    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
      <div>
        <p className="text-sm font-medium">Estimated Total Cost</p>
        <p className="text-2xl font-bold">{formatPrice(getTotalEstimatedCost())}</p>
      </div>
    </div>
  );
}