import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WorkflowProvider } from "./workflow/WorkflowContext";
import { WorkflowContent } from "./workflow/WorkflowContent";
import { LoadingOverlay } from "./workflow/LoadingOverlay";
import { useContractData } from "./workflow/useContractData";

interface ContractWorkflowManagerProps {
  projectId: string;
}

function WorkflowContainer({ projectId }: ContractWorkflowManagerProps) {
  const { data: contract, isLoading } = useContractData(projectId);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return <WorkflowContent projectId={projectId} contract={contract} />;
}

export function ContractWorkflowManager(props: ContractWorkflowManagerProps) {
  return (
    <ErrorBoundary>
      <WorkflowProvider>
        <WorkflowContainer {...props} />
      </WorkflowProvider>
    </ErrorBoundary>
  );
}