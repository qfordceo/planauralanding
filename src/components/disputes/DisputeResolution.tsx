import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DisputeForm } from "./DisputeForm";
import { DisputeList } from "./DisputeList";
import { AlertTriangle, Calendar } from "lucide-react";

interface DisputeResolutionProps {
  projectId: string;
}

export function DisputeResolution({ projectId }: DisputeResolutionProps) {
  const [showNewDisputeForm, setShowNewDisputeForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: disputes, isLoading } = useQuery({
    queryKey: ['project-disputes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_disputes')
        .select(`
          *,
          mediator:mediator_id (
            email
          ),
          raised_by:raised_by_id (
            email
          ),
          against:against_id (
            email
          ),
          mediation_sessions:dispute_mediation_sessions (
            id,
            scheduled_date,
            status,
            resolution_proposal,
            client_accepted,
            contractor_accepted
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const scheduleMediationMutation = useMutation({
    mutationFn: async ({ disputeId, date }: { disputeId: string, date: string }) => {
      const { error } = await supabase
        .from('dispute_mediation_sessions')
        .insert({
          dispute_id: disputeId,
          scheduled_date: date,
          status: 'scheduled'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-disputes'] });
      toast({
        title: "Mediation scheduled",
        description: "The mediation session has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule mediation session.",
        variant: "destructive",
      });
    }
  });

  const acceptResolutionMutation = useMutation({
    mutationFn: async ({ 
      sessionId, 
      isClient 
    }: { 
      sessionId: string, 
      isClient: boolean 
    }) => {
      const { error } = await supabase
        .from('dispute_mediation_sessions')
        .update({
          [isClient ? 'client_accepted' : 'contractor_accepted']: true
        })
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-disputes'] });
      toast({
        title: "Resolution accepted",
        description: "You have accepted the resolution proposal.",
      });
    }
  });

  if (isLoading) {
    return <div>Loading disputes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Dispute Resolution Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showNewDisputeForm ? (
            <Button 
              onClick={() => setShowNewDisputeForm(true)}
              className="mb-6"
            >
              Raise New Dispute
            </Button>
          ) : (
            <DisputeForm
              projectId={projectId}
              onSubmit={() => {
                setShowNewDisputeForm(false);
                queryClient.invalidateQueries({ queryKey: ['project-disputes'] });
              }}
              onCancel={() => setShowNewDisputeForm(false)}
            />
          )}

          <DisputeList
            disputes={disputes || []}
            onScheduleMediation={scheduleMediationMutation.mutate}
            onAcceptResolution={acceptResolutionMutation.mutate}
          />
        </CardContent>
      </Card>
    </div>
  );
}