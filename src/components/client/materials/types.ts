import { MaterialItem } from "@/types/materials";

export interface MaterialCategory {
  name: string;
  items: MaterialItem[];
  estimatedCost: number;
}

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