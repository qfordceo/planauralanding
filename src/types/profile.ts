export type PreApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cash';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  preapproval_status: PreApprovalStatus | null;
  preapproval_amount: number | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  sustainability_preferences?: Json;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]