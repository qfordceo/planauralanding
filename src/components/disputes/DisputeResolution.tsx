import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2,
  MessageSquare,
  Shield,
  AlertCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface DisputeResolutionProps {
  projectId: string;
}

export function DisputeResolution({ projectId }: DisputeResolutionProps) {
  const { toast } = useToast();
  const [newDispute, setNewDispute] = useState("");
  const queryClient = useQueryClient();

  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_disputes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const createDisputeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('project_disputes')
        .insert({
          project_id: projectId,
          description: newDispute,
          status: 'open'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewDispute("");
      queryClient.invalidateQueries({ queryKey: ['disputes', projectId] });
      toast({
        title: "Dispute submitted successfully",
        description: "A mediator will review your case shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Error submitting dispute",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
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
          <Shield className="h-5 w-5" />
          Dispute Resolution Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your dispute..."
              value={newDispute}
              onChange={(e) => setNewDispute(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              onClick={() => createDisputeMutation.mutate()}
              disabled={!newDispute.trim() || createDisputeMutation.isPending}
            >
              {createDisputeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Dispute
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {disputes?.map((dispute) => (
                <Card key={dispute.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">
                          Dispute #{dispute.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {dispute.description}
                      </p>
                    </div>
                    <Badge variant={
                      dispute.status === 'resolved' ? 'default' :
                      dispute.status === 'mediation' ? 'secondary' : 'destructive'
                    }>
                      {dispute.status}
                    </Badge>
                  </div>

                  {dispute.resolution_notes && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">Resolution Notes:</p>
                      <p className="text-sm text-muted-foreground">
                        {dispute.resolution_notes}
                      </p>
                    </div>
                  )}

                  {dispute.status === 'mediation' && (
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Mediator
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}