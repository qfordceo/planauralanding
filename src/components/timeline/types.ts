export interface Contractor {
  business_name: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  start_date: string;
  due_date: string;
  assigned_contractor_id: string;
  contractors?: {
    business_name: string;
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
  project_tasks?: ProjectTask[];
}

export interface TimelineEvent {
  id: string;
  resourceId: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  extendedProps: {
    contractor: string;
    status: string;
  };
}

export interface TimelineResource {
  id: string;
  title: string;
  children?: {
    id: string;
    title: string;
    parentId: string;
  }[];
}