export type WorkflowStage = 
  | 'setup'
  | 'client_review'
  | 'contractor_review'
  | 'completed';

export interface Contract {
  id: string;
  project_id: string;
  status: string;
  workflow_stage: WorkflowStage;
  content: {
    terms: string;
    scope: string;
    payment_schedule: string;
  };
  project: {
    title: string;
    description: string;
    user_id: string;
  };
}

export interface WorkflowState {
  currentStage: WorkflowStage;
  contract: Contract | null;
  error: Error | null;
  isLoading: boolean;
}

export type WorkflowAction =
  | { type: 'SET_STAGE'; payload: WorkflowStage }
  | { type: 'SET_CONTRACT'; payload: Contract }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_LOADING'; payload: boolean };