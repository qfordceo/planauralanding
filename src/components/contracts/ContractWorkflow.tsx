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
        .select(`
          *,
          project:project_id (
            title,
            description,
            user_id
          )
        `)
        .eq("project_id", projectId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
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
            workflow_stage: "client_review",
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

      // Send notification email
      await supabase.functions.invoke("send-contract-email", {
        body: {
          contractId: data.id,
          recipientId: data.project.user_id,
          notificationType: "review"
        },
      });

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
      const isClient = contract?.project.user_id === userProfile?.id;
      const updates = {
        ...(isClient ? {
          workflow_stage: "contractor_review",
          client_signature_data: { signed_at: new Date().toISOString() },
          signed_by_client_at: new Date().toISOString()
        } : {
          workflow_stage: "completed",
          contractor_signature_data: { signed_at: new Date().toISOString() },
          signed_by_contractor_at: new Date().toISOString(),
          status: "signed"
        })
      };

      const { data, error } = await supabase
        .from("project_contracts")
        .update(updates)
        .eq("id", contract?.id)
        .select()
        .single();

      if (error) throw error;

      // Send notification email
      if (isClient) {
        // Notify contractor
        await supabase.functions.invoke("send-contract-email", {
          body: {
            contractId: contract.id,
            recipientId: data.contractor_id,
            notificationType: "review"
          },
        });
      } else {
        // Notify client of completion
        await supabase.functions.invoke("send-contract-email", {
          body: {
            contractId: contract.id,
            recipientId: contract.project.user_id,
            notificationType: "completed"
          },
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
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
      <ContractSetup
        isLoading={createContractMutation.isPending}
        onCreateContract={() => createContractMutation.mutate()}
      />
    );
  }

  if (!hasReviewed) {
    return <ContractReview onReviewComplete={() => setHasReviewed(true)} />;
  }

  return (
    <ContractSignature 
      onSign={() => signContractMutation.mutate()}
      isLoading={signContractMutation.isPending}
    />
  );
}