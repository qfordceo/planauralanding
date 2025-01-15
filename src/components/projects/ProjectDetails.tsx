import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectHeader } from "./details/ProjectHeader";
import { ProjectTabs } from "./details/ProjectTabs";
import { ContractWorkflow } from "../contracts/ContractWorkflow";
import { Loader2 } from "lucide-react";

export interface ProjectDetailsProps {
  projectId: string;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Project not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectHeader projectId={projectId} />
      
      <ContractWorkflow 
        projectId={projectId} 
        onComplete={() => window.location.reload()}
      />

      <ProjectTabs projectId={projectId} />
    </div>
  );
}