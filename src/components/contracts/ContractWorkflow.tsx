import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ContractTerms } from "./ContractTerms";
import { ContractSignature } from "./ContractSignature";

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

      if (error) throw error;
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

  const signContractMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("project_contracts")
        .update({
          status: "signed",
          signed_by_client_at: new Date().toISOString(),
        })
        .eq("id", contract?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Contract Signed",
        description: "You can now proceed to the project management portal",
      });
      onComplete();
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
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Contract Setup</h2>
        <p className="text-muted-foreground mb-4">
          To begin the project, we need to create and sign a contract.
        </p>
        <Button
          onClick={() => createContractMutation.mutate()}
          disabled={createContractMutation.isPending}
        >
          {createContractMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Contract
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Contract Review & Signature</h2>
        <div className="space-y-6">
          <ContractTerms />
          
          {!hasReviewed && (
            <Button onClick={() => setHasReviewed(true)}>
              I Have Reviewed the Terms
            </Button>
          )}

          {hasReviewed && (
            <ContractSignature
              onSign={() => signContractMutation.mutate()}
            />
          )}
        </div>
      </Card>
    </div>
  );
}