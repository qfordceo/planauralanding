import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { DisputeForm } from "./DisputeForm";
import { DisputeList } from "./DisputeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DisputeResolutionProps {
  projectId: string;
}

export function DisputeResolution({ projectId }: DisputeResolutionProps) {
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_disputes')
        .select(`
          *,
          raised_by:raised_by_id(email),
          against:against_id(email),
          mediator:mediator_id(email),
          mediation_sessions:dispute_mediation_sessions(*)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute Resolution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Disputes</TabsTrigger>
            <TabsTrigger value="new">New Dispute</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {disputes && disputes.length > 0 ? (
              <DisputeList disputes={disputes} />
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No active disputes
              </p>
            )}
          </TabsContent>
          <TabsContent value="new">
            <DisputeForm projectId={projectId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}