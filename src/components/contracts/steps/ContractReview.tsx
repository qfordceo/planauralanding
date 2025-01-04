import React from "react";
import { Card } from "@/components/ui/card";
import { ContractTerms } from "../ContractTerms";
import { Button } from "@/components/ui/button";

interface ContractReviewProps {
  onReviewComplete: () => void;
}

export function ContractReview({ onReviewComplete }: ContractReviewProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contract Review</h2>
      <div className="space-y-6">
        <ContractTerms />
        <Button onClick={onReviewComplete}>
          I Have Reviewed the Terms
        </Button>
      </div>
    </Card>
  );
}