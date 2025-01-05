export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  project_updates: boolean;
  contract_updates: boolean;
  payment_updates: boolean;
  milestone_updates: boolean;
  created_at: string;
  updated_at: string;
}

export type NotificationMethod = 'email' | 'sms';