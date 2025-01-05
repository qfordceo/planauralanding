import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectTimeline } from "@/components/client/build-cost/ProjectTimeline";
import { DocumentRepository } from "@/components/client/documents/DocumentRepository";
import { CommunicationHub } from "@/components/client/communication/CommunicationHub";
import { TaskBoard } from "@/components/projects/tasks/board/TaskBoard";
import { ProjectManagementSection } from "@/components/projects/ProjectManagementSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, FileText, MessageSquare, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDashboardProps {
  projectId: string;
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const { data: projectMetrics } = useQuery({
    queryKey: ['project-metrics', projectId],
    queryFn: async () => {
      const [tasksResponse, documentsResponse, messagesResponse] = await Promise.all([
        supabase
          .from('project_tasks')
          .select('status')
          .eq('project_id', projectId),
        supabase
          .from('project_contracts')
          .select('id')
          .eq('project_id', projectId),
        supabase
          .from('project_messages')
          .select('read')
          .eq('project_id', projectId)
      ]);

      const tasks = tasksResponse.data || [];
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      
      const documents = documentsResponse.data || [];
      const messages = messagesResponse.data || [];
      const unreadMessages = messages.filter(m => !m.read).length;

      // Calculate timeline progress based on completed tasks
      const timelineProgress = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

      return {
        totalTasks,
        completedTasks,
        timelineProgress,
        documentsCount: documents.length,
        messagesCount: messages.length,
        unreadMessages
      };
    }
  });

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
            <div className="text-2xl font-bold">{projectMetrics?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics?.completedTasks || 0} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics?.timelineProgress || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics?.timelineProgress === 100 ? 'Complete' : 'On schedule'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics?.documentsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              All documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectMetrics?.messagesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {projectMetrics?.unreadMessages || 0} unread
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