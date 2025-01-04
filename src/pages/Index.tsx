import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflowManager } from "@/components/contracts/ContractWorkflowManager";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: activeProject } = useQuery({
    queryKey: ['active-project'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching project:', error);
        return null;
      }

      return data;
    },
  });

  const createProject = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a project",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: 'New Construction Project',
        description: 'A new home construction project',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setProjectId(data.id);
    toast({
      title: "Success",
      description: "Project created successfully",
    });
  };

  useEffect(() => {
    if (activeProject?.id) {
      setProjectId(activeProject.id);
    }
  }, [activeProject]);

  return (
    <div className="container mx-auto py-8">
      {!projectId ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Welcome to Home Construction Manager</h1>
          <p className="text-muted-foreground">Get started by creating a new project</p>
          <Button onClick={createProject}>Create New Project</Button>
        </div>
      ) : (
        <ContractWorkflowManager projectId={projectId} />
      )}
    </div>
  );
}