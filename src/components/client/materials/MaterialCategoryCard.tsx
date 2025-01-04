import { MaterialCategory } from "./types";
import { MaterialItem } from "./MaterialItem";
import { formatPrice } from "@/lib/utils";

interface MaterialCategoryCardProps {
  category: MaterialCategory;
  onSelectionComplete?: () => void;
}

export function MaterialCategoryCard({ category, onSelectionComplete }: MaterialCategoryCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{category.name}</h3>
        <span className="text-sm text-muted-foreground">
          Estimated: {formatPrice(category.estimatedCost)}
        </span>
      </div>
      <div className="grid gap-4">
        {category.items.map((item) => (
          <MaterialItem 
            key={item.name}
            item={item}
            category={category.name}
            onSelectionComplete={onSelectionComplete}
          />
        ))}
      </div>
    </div>
  );
}