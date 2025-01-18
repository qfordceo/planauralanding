export interface RoomDimensions {
  width: number;
  length: number;
  area: number;
}

export interface Room {
  type: string;
  dimensions: RoomDimensions;
  area: number;
  features: string[];
}

export interface Wall {
  start: { x: number; y: number };
  end: { x: number; y: number };
  height: number;
}

export interface MaterialEstimate {
  name: string;
  flooring: {
    area: number;
    estimates: Array<{ type: string; cost: number }>;
  };
  paint: {
    area: number;
    estimates: Array<{ type: string; cost: number }>;
  };
}

export interface AnalysisResult {
  rooms: Room[];
  walls: Wall[];
  totalArea: number;
  materialEstimates: MaterialEstimate[];
  customizationOptions: {
    flooring: Array<{ name: string; costPerSqFt: number }>;
    paint: Array<{ name: string; costPerSqFt: number }>;
  };
}