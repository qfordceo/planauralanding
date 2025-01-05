import React from "react";
import { Card } from "@/components/ui/card";
import { ContractSetupStage } from "./ContractSetupStage";
import { ClientReviewStage } from "./ClientReviewStage";
import { ContractorReviewStage } from "./ContractorReviewStage";
import { useWorkflow } from "../WorkflowContext";
import { LoadingOverlay } from "../LoadingOverlay";

export function LaunchStages({ projectId }: { projectId: string }) {
  const { state } = useWorkflow();

  if (state.isLoading) {
    return <LoadingOverlay />;
  }

  switch (state.currentStage) {
    case "setup":
      return <ContractSetupStage projectId={projectId} />;
    case "client_review":
      return <ClientReviewStage projectId={projectId} />;
    case "contractor_review":
      return <ContractorReviewStage projectId={projectId} />;
    default:
      return (
        <Card className="p-6">
          <p>Invalid workflow stage</p>
        </Card>
      );
  }
}