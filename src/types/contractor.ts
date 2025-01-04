import { Control, UseFormReturn } from "react-hook-form";

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

export type EntityType = 
  | "individual" 
  | "llc" 
  | "corporation" 
  | "partnership" 
  | "lp" 
  | "llp";

export interface ContractorDayException {
  id: string;
  contractor_id: string | null;
  exception_date: string;
  is_available: boolean | null;
  created_at: string;
}

export interface SSNFieldProps {
  form: UseFormReturn<any>;
  required: boolean;
}

export interface EINFieldProps {
  form: UseFormReturn<any>;
  required: boolean;
  showHelperText?: boolean;
}

export interface FilingNumberFieldProps {
  form: UseFormReturn<any>;
  stateName: string;
  stateCode: string;
}

export interface ContractorFormData {
  business_name: string;
  contact_name: string;
  phone: string;
  contractor_types: ContractorType[];
}

export interface Contractor {
  id: string;
  user_id: string;
  business_name: string;
  contact_name: string;
  phone?: string;
  address?: string;
  contractor_types: ContractorType[];
  bbb_certified?: boolean;
  insurance_verified?: boolean;
  insurance_expiry?: string;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  bid_notifications?: boolean;
  stripe_account_id?: string;
  stripe_account_enabled?: boolean;
  stripe_account_requirements?: any;
  stripe_account_created_at?: string;
  dpa_accepted?: boolean;
  dpa_accepted_at?: string;
  business_classification?: string;
  has_workers_comp?: boolean;
  liability_waiver_accepted?: boolean;
  liability_waiver_accepted_at?: string;
  notification_preferences?: {
    email_notifications: boolean;
    incomplete_steps_reminder: boolean;
  };
}