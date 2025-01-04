export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'needs_review' | 'completed';
export type TaskCategory = 'land_preparation' | 'permits_and_approvals' | 'utilities' | 'foundation' | 'framing' | 'plumbing' | 'electrical' | 'hvac' | 'roofing' | 'exterior' | 'interior' | 'landscaping' | 'inspections';
export type InspectionStatus = 'not_required' | 'scheduled' | 'passed' | 'failed' | 'rescheduled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  assigned_contractor_id?: string;
  start_date?: string;
  due_date?: string;
  completed_date?: string;
  completion_notes?: string;
  attachments?: any[];
  inspection_required: boolean;
  inspection_date?: string;
  inspection_status?: InspectionStatus;
  inspection_notes?: string;
  dependencies?: string[];
}

export interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}