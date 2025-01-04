import { MaterialCategory } from "@/types/materials";

export interface MaterialsCardProps {
  floorPlanId: string;
  onSelectionComplete?: () => void;
}

export interface MaterialsCostSummaryProps {
  materialCategories: MaterialCategory[];
}

export interface MaterialsListProps {
  materialCategories: MaterialCategory[];
  onSelectionComplete?: () => void;
}