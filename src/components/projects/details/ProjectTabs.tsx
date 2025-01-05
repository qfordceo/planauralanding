import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskBoard } from "../tasks/board/TaskBoard";
import { ProjectTimeline } from "../timeline/ProjectTimeline";
import { MilestoneTracker } from "@/components/milestones/MilestoneTracker";
import { DisputeResolution } from "@/components/disputes/DisputeResolution";
import { TimelineEnforcement } from "@/components/timeline/TimelineEnforcement";

interface ProjectTabsProps {
  projectId: string;
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
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
  );
}