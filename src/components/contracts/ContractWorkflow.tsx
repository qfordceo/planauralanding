import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ContractSetup } from "./steps/ContractSetup";
import { ContractReview } from "./steps/ContractReview";
import { ContractSignature } from "./ContractSignature";
import { Loader2 } from "lucide-react";

interface ContractWorkflowProps {
  projectId: string;
  onComplete: () => void;
}

export function ContractWorkflow({ projectId, onComplete }: ContractWorkflowProps) {
  const [hasReviewed, setHasReviewed] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contract, isLoading } = useQuery({
    queryKey: ["project-contract", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_contracts")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const createContractMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("project_contracts")
        .insert([
          {
            project_id: projectId,
            contract_type: "construction",
            status: "draft",
            content: {
              terms: "Standard construction contract terms...",
              scope: "Full home construction as per approved plans...",
              payment_schedule: "As per milestone completion...",
            },
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
      toast({
        title: "Contract Created",
        description: "Please review the contract terms",
      });
    },
  });

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
        isLoading={createContractMutation.isPending}
        onCreateContract={() => createContractMutation.mutate()}
      />
    );
  }

  if (!hasReviewed) {
    return <ContractReview onReviewComplete={() => setHasReviewed(true)} />;
  }

  return <ContractSignature onSign={onComplete} />;
}