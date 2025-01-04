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
}

export interface ProfileUpdate extends Partial<Profile> {
  id: string;
}