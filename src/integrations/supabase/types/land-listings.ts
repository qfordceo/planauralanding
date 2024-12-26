export interface LandListing {
  acres: number | null;
  address: string | null;
  avg_area_price_per_acre: number | null;
  created_at: string;
  id: string;
  image_url: string | null;
  price: number | null;
  price_per_acre: number | null;
  realtor_url: string | null;
  title: string | null;
  updated_at: string;
}

export interface LandListingInsert extends Partial<Omit<LandListing, 'id' | 'created_at' | 'updated_at'>> {}

export interface LandListingUpdate extends Partial<LandListingInsert> {
  id?: string;
}