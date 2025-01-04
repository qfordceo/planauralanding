import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ProjectList } from "./ProjectList";
import { useState } from "react";
import { NewProjectDialog } from "./NewProjectDialog";
import { supabase } from "@/integrations/supabase/client";

export function ProjectManagementSection() {
  const [showNewProject, setShowNewProject] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Projects</h2>
        <Button onClick={() => setShowNewProject(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {!projects?.length ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>You haven't created any projects yet.</p>
          <p className="text-sm mt-2">Click the New Project button to get started.</p>
        </Card>
      ) : (
        <ProjectList />
      )}

      <NewProjectDialog 
        open={showNewProject} 
        onOpenChange={setShowNewProject}
        userId={user?.id || ''}
      />
    </div>
  );
}