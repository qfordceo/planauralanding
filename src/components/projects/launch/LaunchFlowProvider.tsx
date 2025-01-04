import { createContext, useContext, useReducer, ReactNode } from 'react';

type LaunchStage = 'contract_setup' | 'contract_workflow' | 'completed';

interface LaunchState {
  currentStage: LaunchStage;
  contractCreated: boolean;
  error: Error | null;
}

type LaunchAction = 
  | { type: 'SET_STAGE'; payload: LaunchStage }
  | { type: 'SET_CONTRACT_CREATED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

const LaunchContext = createContext<{
  state: LaunchState;
  dispatch: React.Dispatch<LaunchAction>;
} | undefined>(undefined);

function launchReducer(state: LaunchState, action: LaunchAction): LaunchState {
  switch (action.type) {
    case 'SET_STAGE':
      return { ...state, currentStage: action.payload };
    case 'SET_CONTRACT_CREATED':
      return { ...state, contractCreated: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function LaunchFlowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(launchReducer, {
    currentStage: 'contract_setup',
    contractCreated: false,
    error: null,
  });

  return (
    <LaunchContext.Provider value={{ state, dispatch }}>
      {children}
    </LaunchContext.Provider>
  );
}

export function useLaunchFlow() {
  const context = useContext(LaunchContext);
  if (!context) {
    throw new Error('useLaunchFlow must be used within a LaunchFlowProvider');
  }
  return context;
}