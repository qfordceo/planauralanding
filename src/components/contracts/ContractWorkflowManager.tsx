import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflow } from "./ContractWorkflow";
import { ProjectDetails } from "../projects/ProjectDetails";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const activatePortalMutation = useMutation({
    mutationFn: async () => {
      // Update project status to active
      const { error: projectError } = await supabase
        .from("projects")
        .update({ status: "active" })
        .eq("id", projectId);

      if (projectError) throw projectError;

      // Create initial project milestones
      const { error: milestonesError } = await supabase
        .from("project_milestones")
        .insert([
          {
            build_estimate_id: projectId,
            title: "Project Kickoff",
            description: "Initial meeting and project setup",
            status: "pending"
          },
          {
            build_estimate_id: projectId,
            title: "Foundation Work",
            description: "Preparation and foundation laying",
            status: "pending"
          }
        ]);

      if (milestonesError) throw milestonesError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-contract"] });
      toast({
        title: "Project Activated",
        description: "Your project portal has been activated successfully.",
      });
      navigate(`/project/${projectId}`);
    },
    onError: (error) => {
      console.error("Error activating portal:", error);
      toast({
        title: "Error",
        description: "Failed to activate project portal. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (contract?.status === "signed") {
      activatePortalMutation.mutate();
    }
  }, [contract?.status]);

  if (contract?.status === "signed") {
    return <ProjectDetails projectId={projectId} />;
  }

  return (
    <ContractWorkflow
      projectId={projectId}
      onComplete={() => window.location.reload()}
    />
  );
}