import type { FloorPlan, FloorPlanInsert, FloorPlanUpdate } from './floor-plans';
import type { LandListing, LandListingInsert, LandListingUpdate } from './land-listings';
import type { Profile, ProfileInsert, ProfileUpdate } from './profiles';
import type { ContractorPayment, ContractorPaymentSettings } from './payments';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      floor_plans: {
        Row: FloorPlan;
        Insert: FloorPlanInsert;
        Update: FloorPlanUpdate;
        Relationships: [];
      };
      land_listings: {
        Row: LandListing;
        Insert: LandListingInsert;
        Update: LandListingUpdate;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      contractor_payments: {
        Row: ContractorPayment;
        Insert: Omit<ContractorPayment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContractorPayment, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "contractor_payments_contractor_id_fkey"
            columns: ["contractor_id"]
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_payments_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ];
      };
      contractor_payment_settings: {
        Row: ContractorPaymentSettings;
        Insert: Omit<ContractorPaymentSettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ContractorPaymentSettings, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [
          {
            foreignKeyName: "contractor_payment_settings_contractor_id_fkey"
            columns: ["contractor_id"]
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type { FloorPlan, FloorPlanInsert, FloorPlanUpdate } from './floor-plans';
export type { LandListing, LandListingInsert, LandListingUpdate } from './land-listings';
export type { Profile, ProfileInsert, ProfileUpdate } from './profiles';
export type { ContractorPayment, ContractorPaymentSettings } from './payments';