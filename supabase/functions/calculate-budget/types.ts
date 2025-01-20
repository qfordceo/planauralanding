export interface BudgetInput {
  floorPlanId: string;
  landListingId: string;
  customizations?: Record<string, any>;
}

export interface MarketRates {
  laborRate: number;
  materialMultiplier: number;
  locationFactor: number;
}

export interface MaterialCosts {
  baseMaterials: number;
  customMaterials: number;
  wastageEstimate: number;
}

export interface BudgetResult {
  totalCost: number;
  breakdown: {
    materials: number;
    labor: number;
    overhead: number;
    contingency: number;
  };
  marketFactors: MarketRates;
}