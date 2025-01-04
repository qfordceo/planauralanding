import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ContractSetupProps {
  isLoading: boolean;
  onCreateContract: () => void;
}

export function ContractSetup({ isLoading, onCreateContract }: ContractSetupProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contract Setup</h2>
      <p className="text-muted-foreground mb-4">
        To begin the project, we need to create and sign a contract.
      </p>
      <Button
        onClick={onCreateContract}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        Create Contract
      </Button>
    </Card>
  );
}