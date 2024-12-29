export type ContractorType = 
  | "electrical"
  | "plumbing"
  | "hvac"
  | "roofing"
  | "foundation"
  | "framing"
  | "drywall"
  | "painting"
  | "landscaping"
  | "general";

export interface Contractor {
  id: string;
  user_id: string | null;
  business_name: string;
  contact_name: string;
  phone: string | null;
  address: string | null;
  contractor_types: ContractorType[];
  bbb_certified: boolean | null;
  insurance_verified: boolean | null;
  insurance_expiry: string | null;
  created_at: string;
  updated_at: string;
  dpa_accepted: boolean | null;
  dpa_accepted_at: string | null;
}

export interface ContractorFormData {
  business_name: string;
  contact_name: string;
  phone: string;
  contractor_types: ContractorType[];
}

export interface ContractorDayException {
  id: string;
  contractor_id: string | null;
  exception_date: string;
  is_available: boolean | null;
  created_at: string;
}