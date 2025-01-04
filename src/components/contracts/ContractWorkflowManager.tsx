import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflow } from "./ContractWorkflow";
import { ProjectDetails } from "../projects/ProjectDetails";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const { data: contract } = useQuery({
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