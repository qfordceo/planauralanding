import { Database } from "@/integrations/supabase/types";

export type ContractorType = Database["public"]["Enums"]["contractor_type"];

export type EntityType = 
  | "sole_proprietorship"
  | "llc"
  | "corporation"
  | "partnership";

export interface ContractorDayException {
  id: string;
  contractor_id: string;
  exception_date: string;
  is_available: boolean;
  created_at: string;
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
  phone: string | null;
  address: string | null;
  contractor_types: ContractorType[];
  bbb_certified: boolean | null;
  insurance_verified: boolean | null;
  insurance_expiry: string | null;
  created_at: string;
  updated_at: string;
  average_rating: number | null;
}

export interface OnboardingStep {
  id: string;
  step_name: string;
  completed: boolean;
  completed_at: string | null;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  content: string;
  resource_type: 'article' | 'video' | 'template' | 'guide';
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_reading_time: number | null;
  tags: string[];
  external_links: {
    title: string;
    url: string;
  }[];
}