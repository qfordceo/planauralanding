export type WorkflowStage = 
  | 'setup'
  | 'client_review'
  | 'contractor_review'
  | 'completed';

export interface WorkflowState {
  currentStage: WorkflowStage;
  contract: any | null;
  error: Error | null;
  isLoading: boolean;
}

export type WorkflowAction =
  | { type: 'SET_STAGE'; payload: WorkflowStage }
  | { type: 'SET_CONTRACT'; payload: any }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_LOADING'; payload: boolean };