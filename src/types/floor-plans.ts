export interface Room {
  type: string;
  dimensions: {
    width: number;
    length: number;
  };
  area: number;
  features: string[];
}

export interface MaterialEstimate {
  name: string;
  flooring: {
    area: number;
    estimates: Array<{
      type: string;
      cost: number;
    }>;
  };
  paint: {
    area: number;
    estimates: Array<{
      type: string;
      cost: number;
    }>;
  };
}

export interface CustomizationOption {
  name: string;
  costPerSqFt: number;
}

export interface AnalysisResult {
  rooms: Room[];
  totalArea: number;
  materialEstimates: MaterialEstimate[];
  customizationOptions: {
    flooring: CustomizationOption[];
    paint: CustomizationOption[];
  };
}

export interface CustomizationOptions {
  flooringCostPerSqFt: number;
  paintCostPerSqFt: number;
}