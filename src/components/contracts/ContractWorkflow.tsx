import React from "react";
import { ContractSteps } from "./workflow/ContractSteps";

interface ContractWorkflowProps {
  projectId: string;
  onComplete: () => void;
}

export function ContractWorkflow({ projectId, onComplete }: ContractWorkflowProps) {
  return <ContractSteps projectId={projectId} onComplete={onComplete} />;
}