export interface AdminStats {
  totalProjects: number;
  pendingApprovals: number;
}

export interface AdminData {
  profile: {
    id: string;
    email: string;
    is_admin: boolean;
  } | null;
  stats: AdminStats;
}

export interface AdminMetricsProps {
  stats: AdminStats;
}

export interface AdminTabProps {
  children: React.ReactNode;
}