import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "../tabs/ProjectOverview";
import { ProjectTasksTab } from "../tabs/ProjectTasksTab";
import { ProjectDocumentsTab } from "../tabs/ProjectDocumentsTab";
import { ProjectDisputesTab } from "../tabs/ProjectDisputesTab";
import { TimelineContainer } from "@/components/timeline/TimelineContainer";

interface ProjectTabsProps {
  projectId: string;
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="disputes">Disputes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProjectOverview projectId={projectId} />
      </TabsContent>

      <TabsContent value="timeline">
        <TimelineContainer projectId={projectId} />
      </TabsContent>

      <TabsContent value="tasks">
        <ProjectTasksTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="documents">
        <ProjectDocumentsTab projectId={projectId} />
      </TabsContent>

      <TabsContent value="disputes">
        <ProjectDisputesTab projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
}