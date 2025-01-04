import { Database } from "@/integrations/supabase/types";

export type ContractorType = 
  | "general"
  | "electrical"
  | "plumbing"
  | "hvac"
  | "roofing"
  | "foundation"
  | "framing"
  | "drywall"
  | "painting"
  | "landscaping";

export type EntityType = 
  | "individual"
  | "llc"
  | "corporation"
  | "partnership"
  | "lp"
  | "llp";

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
  bid_notifications?: boolean;
  stripe_account_id?: string;
  stripe_account_enabled?: boolean;
  dpa_accepted?: boolean;
  dpa_accepted_at?: string;
  has_workers_comp?: boolean;
  liability_waiver_accepted?: boolean;
  liability_waiver_accepted_at?: string;
}

export interface ContractorMetrics {
  totalProjects: number;
  completedProjects: number;
  onTimeRate: number;
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

export type BadgeType = 
  | "expeditious"
  | "clientFavorite" 
  | "precision"
  | "responsive"
  | "adaptable"
  | "topContractor"
  | "highVolume"
  | "preferred"
  | "compliant"
  | "paperwork"
  | "safety";