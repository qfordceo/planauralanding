import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ProjectList } from "./ProjectList";
import { useState } from "react";
import { NewProjectDialog } from "./NewProjectDialog";

interface ProjectManagementSectionProps {
  userId: string;
}

export function ProjectManagementSection({ userId }: ProjectManagementSectionProps) {
  const [showNewProject, setShowNewProject] = useState(false);
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse" />
          ))}
        </div>
      ) : !projects?.length ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>You haven't created any projects yet.</p>
          <p className="text-sm mt-2">Click the New Project button to get started.</p>
        </Card>
      ) : (
        <ProjectList projects={projects} />
      )}

      <NewProjectDialog 
        open={showNewProject} 
        onOpenChange={setShowNewProject}
        userId={userId}
      />
    </div>
  );
}