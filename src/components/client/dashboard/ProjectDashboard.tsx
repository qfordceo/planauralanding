import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTimeline } from "@/components/client/build-cost/ProjectTimeline";
import { DocumentRepository } from "@/components/client/documents/DocumentRepository";
import { CommunicationHub } from "@/components/client/communication/CommunicationHub";
import { TaskBoard } from "@/components/projects/tasks/board/TaskBoard";
import { ProjectManagementSection } from "@/components/projects/ProjectManagementSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, FileText, MessageSquare, LayoutDashboard } from "lucide-react";

interface ProjectDashboardProps {
  projectId: string;
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-xs text-muted-foreground">
              On schedule
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              2 unread
            </p>
          </CardContent>
        </Card>
      </div>

      <ProjectManagementSection />

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <TaskBoard projectId={projectId} />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <ProjectTimeline projectId={projectId} />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentRepository projectId={projectId} />
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <CommunicationHub projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}