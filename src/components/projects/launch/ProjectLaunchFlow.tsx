import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ContractWorkflowManager } from "@/components/contracts/ContractWorkflowManager";
import { ContractSetupStage } from "./stages/ContractSetupStage";
import { LaunchFlowProvider, useLaunchFlow } from "./LaunchFlowProvider";

interface ProjectLaunchFlowProps {
  projectId: string;
  acceptedBid: {
    id: string;
    contractor_id: string;
    bid_amount: number;
  };
}

function LaunchFlowContent({ projectId, acceptedBid }: ProjectLaunchFlowProps) {
  const { state, dispatch } = useLaunchFlow();

  if (state.contractCreated) {
    return <ContractWorkflowManager projectId={projectId} />;
  }

  return (
    <ContractSetupStage
      projectId={projectId}
      acceptedBid={acceptedBid}
      onContractCreated={() => {
        dispatch({ type: 'SET_CONTRACT_CREATED', payload: true });
        dispatch({ type: 'SET_STAGE', payload: 'contract_workflow' });
      }}
    />
  );
}

export function ProjectLaunchFlow(props: ProjectLaunchFlowProps) {
  return (
    <ErrorBoundary>
      <LaunchFlowProvider>
        <LaunchFlowContent {...props} />
      </LaunchFlowProvider>
    </ErrorBoundary>
  );
}