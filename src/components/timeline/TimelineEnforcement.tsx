import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2,
  Calendar,
  AlertOctagon,
  Bell
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TimelineEnforcementProps {
  projectId: string;
}

export function TimelineEnforcement({ projectId }: TimelineEnforcementProps) {
  const { toast } = useToast();

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ['timeline-agreement', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timeline_agreements')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: delays, isLoading: delaysLoading } = useQuery({
    queryKey: ['delay-notifications', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_delay_notifications')
        .select(`
          *,
          milestone:project_milestones (
            title
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleAcceptResolution = async (delayId: string) => {
    try {
      const { error } = await supabase
        .from('project_delay_notifications')
        .update({ status: 'resolved' })
        .eq('id', delayId);

      if (error) throw error;

      toast({
        title: "Resolution accepted",
        description: "The delay has been marked as resolved.",
      });
    } catch (error) {
      toast({
        title: "Error accepting resolution",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (timelineLoading || delaysLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Timeline Enforcement
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeline && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Timeline Agreement</h3>
                <p className="text-sm text-muted-foreground">
                  Completion Date: {new Date(timeline.agreed_completion_date).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={timeline.status === 'signed' ? 'default' : 'outline'}>
                {timeline.status}
              </Badge>
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {delays?.map((delay) => (
              <Card key={delay.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {delay.severity === 'critical' ? (
                        <AlertOctagon className="h-4 w-4 text-red-500" />
                      ) : (
                        <Bell className="h-4 w-4 text-yellow-500" />
                      )}
                      <h3 className="font-medium">
                        {delay.milestone?.title} Delay
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {delay.delay_days} days behind schedule
                    </p>
                  </div>
                  <Badge variant={
                    delay.status === 'resolved' ? 'default' :
                    delay.severity === 'critical' ? 'destructive' : 'secondary'
                  }>
                    {delay.status}
                  </Badge>
                </div>

                {delay.resolution_action && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Proposed Resolution:</p>
                    <p className="text-sm text-muted-foreground">
                      {delay.resolution_action}
                    </p>
                  </div>
                )}

                {delay.status === 'pending' && delay.resolution_action && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptResolution(delay.id)}
                    >
                      Accept Resolution
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}