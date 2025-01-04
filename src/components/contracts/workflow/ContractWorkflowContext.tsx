import { createContext, useContext, useReducer, ReactNode } from 'react';

interface ContractState {
  currentStep: number;
  contractData: any;
  signingStatus: {
    clientSigned: boolean;
    contractorSigned: boolean;
  };
}

type Action =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_CONTRACT'; payload: any }
  | { type: 'UPDATE_SIGNING_STATUS'; payload: { clientSigned: boolean; contractorSigned: boolean } };

const ContractWorkflowContext = createContext<{
  state: ContractState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function contractReducer(state: ContractState, action: Action): ContractState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_CONTRACT':
      return { ...state, contractData: action.payload };
    case 'UPDATE_SIGNING_STATUS':
      return { ...state, signingStatus: action.payload };
    default:
      return state;
  }
}

export function ContractWorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contractReducer, {
    currentStep: 0,
    contractData: null,
    signingStatus: {
      clientSigned: false,
      contractorSigned: false,
    },
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