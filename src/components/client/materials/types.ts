export interface MaterialCategory {
  name: string;
  items: MaterialItem[];
  estimatedCost: number;
}

export interface MaterialItem {
  name: string;
  description: string;
  estimatedCost: number;
  unit: string;
  quantity: number;
  category: string;
  selectedProduct?: {
    name: string;
    price: number;
    url?: string;
  };
}

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