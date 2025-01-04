import React from "react";
import { ContractWorkflow } from "./ContractWorkflow";
import { ProjectDetails } from "../projects/ProjectDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useContractWorkflow } from "./workflow/useContractWorkflow";
import { ContractStageIndicator } from "./workflow/ContractStageIndicator";
import { ContractSigningStatus } from "./workflow/ContractSigningStatus";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const {
    contract,
    isLoading,
    createContract,
    isCreatingContract
  } = useContractWorkflow(projectId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Setup Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">No contract has been created for this project yet.</p>
          <Button 
            onClick={() => createContract()}
            disabled={isCreatingContract}
          >
            {isCreatingContract && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Contract
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (contract.status === "signed" && contract.workflow_stage === "completed") {
    return <ProjectDetails projectId={projectId} />;
  }

  return (
    <div className="space-y-6">
      <ContractStageIndicator currentStage={contract.workflow_stage} />
      <ContractSigningStatus contract={contract} />
      <ContractWorkflow
        projectId={projectId}
        onComplete={() => window.location.reload()}
      />
    </div>
  );
}