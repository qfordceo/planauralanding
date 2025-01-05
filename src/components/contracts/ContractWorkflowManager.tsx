import { ErrorBoundary } from "@/components/ErrorBoundary";
import { WorkflowProvider } from "./workflow/WorkflowContext";
import { LaunchStages } from "./workflow/stages/LaunchStages";
import { useWorkflowState } from "./workflow/hooks/useWorkflowState";
import { WorkflowStage } from "./workflow/stages/WorkflowStage";
import { Loader2 } from "lucide-react";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const { currentStage, isLoading, error } = useWorkflowState();

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <ErrorBoundary>{error.message}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary>
      <WorkflowProvider>
        <WorkflowStage 
          title="Contract Workflow" 
          stage={currentStage}
        >
          <LaunchStages projectId={projectId} />
        </WorkflowStage>
      </WorkflowProvider>
    </ErrorBoundary>
  );
}