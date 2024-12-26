export interface Profile {
  created_at: string;
  email: string | null;
  id: string;
  is_admin: boolean | null;
  updated_at: string;
}

export interface ProfileInsert extends Partial<Omit<Profile, 'created_at' | 'updated_at'>> {
  id: string;
}

export interface ProfileUpdate extends Partial<ProfileInsert> {
  id?: string;
}