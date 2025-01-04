import { Profile } from "./profile";

export interface AdminStats {
  totalUsers: number;
  activeProjects: number;
  pendingApprovals: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'project' | 'approval' | 'compliance' | 'dispute';
  description: string;
  timestamp: string;
  status: string;
}

export interface AdminDashboardProps {
  profile: Profile | null;
}

export interface DashboardTabProps {
  children: React.ReactNode;
}