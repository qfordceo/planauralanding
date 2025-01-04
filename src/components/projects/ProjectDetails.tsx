import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTimeline } from "./timeline/ProjectTimeline";
import { ProjectOverview } from "./tabs/ProjectOverview";
import { ProjectTasksTab } from "./tabs/ProjectTasksTab";
import { ProjectDisputesTab } from "./tabs/ProjectDisputesTab";
import { ProjectDocumentsTab } from "./tabs/ProjectDocumentsTab";
import { Loader2 } from "lucide-react";

interface ProjectDetailsProps {
  projectId: string;
  tasks?: any[];
}

export function ProjectDetails({ projectId, tasks }: ProjectDetailsProps) {
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
      <ProjectOverview 
        title={project.title} 
        description={project.description} 
      />

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline projectId={projectId} tasks={tasks} />
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <ProjectTasksTab />
        </TabsContent>

        <TabsContent value="disputes" className="mt-6">
          <ProjectDisputesTab />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <ProjectDocumentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}