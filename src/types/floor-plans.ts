export interface Room {
  type: string;
  dimensions: {
    width: number;
    length: number;
  };
  area: number;
  features: string[];
}

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface MaterialCategory {
  category: string;
  items: MaterialItem[];
}

export interface AnalysisResult {
  rooms: Room[];
  totalArea: number;
  materialEstimates: MaterialCategory[];
}

export interface CustomizationOptions {
  flooringCostPerSqFt: number;
  paintCostPerSqFt: number;
}