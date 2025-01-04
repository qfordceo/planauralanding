export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  project_updates: boolean;
  contract_updates: boolean;
  payment_updates: boolean;
  marketing_updates: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationMethod = 'email' | 'sms';