export interface ContractVersion {
  version: number;
  content: any;
  timestamp: string;
  author_id: string;
}

export interface ContractApproval {
  user_id: string;
  timestamp: string;
  status: 'approved' | 'rejected';
  comments?: string;
}

export interface ProjectContract {
  id: string;
  project_id: string;
  status: string;
  content: any;
  version_history: ContractVersion[];
  last_reviewed_at?: string;
  review_comments?: string;
  approval_chain: ContractApproval[];
  created_at: string;
  updated_at: string;
}