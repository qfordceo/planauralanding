import { MaterialCategory } from "./types";
import { MaterialCategoryCard } from "./MaterialCategoryCard";

interface MaterialsListProps {
  materialCategories: MaterialCategory[];
  onSelectionComplete?: () => void;
}

export function MaterialsList({ materialCategories, onSelectionComplete }: MaterialsListProps) {
  return (
    <>
      {materialCategories.map((category) => (
        <MaterialCategoryCard 
          key={category.name}
          category={category}
          onSelectionComplete={onSelectionComplete}
        />
      ))}
    </>
  );
}