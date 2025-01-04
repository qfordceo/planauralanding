export type PreApprovalStatus = 'pending' | 'approved' | 'rejected' | 'cash';

export interface NotificationPreferences {
  email_enabled: boolean;
  sms_enabled: boolean;
  project_updates: boolean;
  contract_updates: boolean;
  payment_updates: boolean;
  marketing_updates: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  preferred_contact_method: 'email' | 'sms';
  timezone: string;
  account_status: 'active' | 'inactive' | 'suspended';
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  notification_preferences?: NotificationPreferences;
  preapproval_status?: PreApprovalStatus;
  preapproval_amount?: number | null;
  phone?: string | null;
  address?: string | null;
  is_admin?: boolean;
}

export interface ProfileUpdate extends Partial<Profile> {
  id: string;
}