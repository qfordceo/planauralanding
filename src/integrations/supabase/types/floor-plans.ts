export interface FloorPlan {
  bathrooms: number;
  bedrooms: number;
  created_at: string;
  description: string | null;
  foundation_type: string | null;
  id: string;
  image_url: string | null;
  name: string;
  plan_price: number;
  square_feet: number;
  style: string | null;
  updated_at: string;
}

export interface FloorPlanInsert extends Partial<Omit<FloorPlan, 'id' | 'created_at' | 'updated_at'>> {
  bathrooms: number;
  bedrooms: number;
  name: string;
  plan_price: number;
  square_feet: number;
}

export interface FloorPlanUpdate extends Partial<FloorPlanInsert> {
  id?: string;
}