import { MaterialCategory, MaterialItem } from "@/types/materials";

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