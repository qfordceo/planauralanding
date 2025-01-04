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
