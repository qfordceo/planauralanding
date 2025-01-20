export interface Contractor {
  id: string;
  business_name: string;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';

export interface ProjectTask {
  id: string;
  title: string;
  status: TaskStatus;
  start_date: string;
  due_date: string;
  assigned_contractor_id: string;
  contractors?: Contractor[];
  phase: string;
}

export interface Milestone {
  id: string;
  title: string;
  due_date: string;
  status: string;
  phase: string;
}

export interface TimelineEventExtendedProps {
  contractor?: string;
  status: TaskStatus | string;
  phase: string;
  type?: 'milestone';
}

export interface TimelineEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor?: string;
  display?: string;
  extendedProps: TimelineEventExtendedProps;
}

export interface TimelineResource {
  id: string;
  title: string;
}