import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, MessageSquare } from "lucide-react";
import { ProjectTimeline } from "@/components/timeline/monitoring/ProjectTimeline";
import { DocumentRepository } from "./documents/DocumentRepository";
import { CommunicationHub } from "./communication/CommunicationHub";
import { BuildCostCard } from "./BuildCostCard";
import { MaterialsCard } from "./MaterialsCard";
import { SavedFloorPlans } from "./SavedFloorPlans";
import { SavedLandPlots } from "./SavedLandPlots";

export function ClientDashboard() {
  const { data: activeProject } = useQuery({
    queryKey: ['active-project'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_contracts(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching project:', error);
        return null;
      }

      return data;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6">
        {activeProject ? (
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <ProjectTimeline projectId={activeProject.id} />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <DocumentRepository projectId={activeProject.id} />
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <CommunicationHub projectId={activeProject.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <SavedFloorPlans />
                <SavedLandPlots />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}