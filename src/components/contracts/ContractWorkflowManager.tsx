import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WorkflowProvider } from "./workflow/WorkflowContext";
import { LaunchStages } from "./workflow/stages/LaunchStages";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  return (
    <ErrorBoundary>
      <WorkflowProvider>
        <LaunchStages projectId={projectId} />
      </WorkflowProvider>
    </ErrorBoundary>
  );
}