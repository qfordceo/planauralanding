import { MaterialCategory as MaterialCategoryType, MaterialItem } from "@/types/materials";

export type MaterialCategory = MaterialCategoryType;

export interface MaterialsCostSummaryProps {
  materialCategories: MaterialCategory[];
}

export interface MaterialsListProps {
  materialCategories: MaterialCategory[];
  onSelectionComplete?: () => void;
}

export interface MaterialsCardProps {
  floorPlanId: string;
  onSelectionComplete?: () => void;
}