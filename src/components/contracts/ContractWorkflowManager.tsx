import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ContractWorkflow } from "./ContractWorkflow";
import { ProjectTimeline } from "../client/build-cost/ProjectTimeline";
import { DisputeResolution } from "../disputes/DisputeResolution";
import { TimelineEnforcement } from "../timeline/TimelineEnforcement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface ContractWorkflowManagerProps {
  projectId: string;
}

export function ContractWorkflowManager({ projectId }: ContractWorkflowManagerProps) {
  const [activeTab, setActiveTab] = useState("contract");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_contracts (*)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="enforcement">Timeline Enforcement</TabsTrigger>
          </TabsList>

          <TabsContent value="contract" className="mt-4">
            <ContractWorkflow 
              projectId={projectId} 
              onComplete={() => {
                queryClient.invalidateQueries({ queryKey: ['project'] });
                setActiveTab("timeline");
              }} 
            />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <ProjectTimeline projectId={projectId} />
          </TabsContent>

          <TabsContent value="disputes" className="mt-4">
            <DisputeResolution projectId={projectId} />
          </TabsContent>

          <TabsContent value="enforcement" className="mt-4">
            <TimelineEnforcement projectId={projectId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}