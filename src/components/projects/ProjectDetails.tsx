import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTimeline } from "./timeline/ProjectTimeline";
import { ProjectOverview } from "./tabs/ProjectOverview";
import { ContractWorkflow } from "../contracts/ContractWorkflow";
import { MilestoneTracker } from "../milestones/MilestoneTracker";
import { DisputeResolution } from "../disputes/DisputeResolution";
import { TimelineEnforcement } from "../timeline/TimelineEnforcement";
import { TaskBoard } from "./tasks/board/TaskBoard";
import { Loader2 } from "lucide-react";

interface ProjectDetailsProps {
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
      <ProjectOverview 
        title={project.title} 
        description={project.description} 
      />

      <ContractWorkflow projectId={projectId} />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="enforcement">Timeline Enforcement</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <TaskBoard projectId={projectId} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline projectId={projectId} />
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <MilestoneTracker projectId={projectId} />
        </TabsContent>

        <TabsContent value="disputes" className="mt-6">
          <DisputeResolution projectId={projectId} />
        </TabsContent>

        <TabsContent value="enforcement" className="mt-6">
          <TimelineEnforcement projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}