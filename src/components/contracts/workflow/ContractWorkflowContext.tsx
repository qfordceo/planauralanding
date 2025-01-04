import { createContext, useContext, useReducer, ReactNode } from 'react';

type WorkflowStage = 'draft' | 'client_review' | 'contractor_review' | 'completed';
type SigningStatus = 'pending' | 'client_signed' | 'contractor_signed' | 'completed';

interface ContractState {
  currentStage: WorkflowStage;
  signingStatus: SigningStatus;
  lastAction: Date | null;
  signingHistory: Array<{
    action: string;
    timestamp: Date;
    actor: string;
  }>;
}

type Action =
  | { type: 'SET_STAGE'; payload: WorkflowStage }
  | { type: 'UPDATE_SIGNING_STATUS'; payload: SigningStatus }
  | { type: 'ADD_SIGNING_HISTORY'; payload: { action: string; actor: string } };

const ContractWorkflowContext = createContext<{
  state: ContractState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function contractReducer(state: ContractState, action: Action): ContractState {
  switch (action.type) {
    case 'SET_STAGE':
      return { 
        ...state, 
        currentStage: action.payload,
        lastAction: new Date()
      };
    case 'UPDATE_SIGNING_STATUS':
      return { 
        ...state, 
        signingStatus: action.payload,
        lastAction: new Date()
      };
    case 'ADD_SIGNING_HISTORY':
      return {
        ...state,
        signingHistory: [
          ...state.signingHistory,
          {
            action: action.payload.action,
            timestamp: new Date(),
            actor: action.payload.actor
          }
        ],
        lastAction: new Date()
      };
    default:
      return state;
  }
}

export function ContractWorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contractReducer, {
    currentStage: 'draft',
    signingStatus: 'pending',
    lastAction: null,
    signingHistory: []
  });

  return (
    <ContractWorkflowContext.Provider value={{ state, dispatch }}>
      {children}
    </ContractWorkflowContext.Provider>
  );
}

export function useContractWorkflow() {
  const context = useContext(ContractWorkflowContext);
  if (context === undefined) {
    throw new Error('useContractWorkflow must be used within a ContractWorkflowProvider');
  }
  return context;
}