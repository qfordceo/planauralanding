import React from "react";
import { ContractSetup } from "../steps/ContractSetup";
import { ContractReview } from "../steps/ContractReview";
import { ContractSignature } from "../ContractSignature";
import { Loader2 } from "lucide-react";
import { useContractWorkflow } from "./useContractWorkflow";

interface ContractStepsProps {
  projectId: string;
  onComplete: () => void;
}

export function ContractSteps({ projectId, onComplete }: ContractStepsProps) {
  const [hasReviewed, setHasReviewed] = React.useState(false);
  const {
    contract,
    isLoading,
    createContract,
    signContract,
    isSigningContract,
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
      <ContractSetup
        isLoading={isCreatingContract}
        onCreateContract={createContract}
      />
    );
  }

  if (!hasReviewed) {
    return <ContractReview onReviewComplete={() => setHasReviewed(true)} />;
  }

  return (
    <ContractSignature 
      onSign={() => {
        signContract(undefined, {
          onSuccess: onComplete
        });
      }}
      isLoading={isSigningContract}
    />
  );
}