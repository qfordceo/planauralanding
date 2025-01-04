import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Dispute {
  id: string;
  description: string;
  status: string;
  created_at: string;
  mediation_status: string;
  raised_by: { email: string };
  against: { email: string };
  mediator: { email: string } | null;
  mediation_sessions: {
    id: string;
    scheduled_date: string;
    status: string;
  }[];
}

interface DisputeListProps {
  disputes: Dispute[];
}

export function DisputeList({ disputes }: DisputeListProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const scheduleMediationMutation = useMutation({
    mutationFn: async ({ disputeId, date }: { disputeId: string; date: Date }) => {
      const { error } = await supabase
        .from('dispute_mediation_sessions')
        .insert({
          dispute_id: disputeId,
          scheduled_date: date.toISOString(),
          status: 'scheduled'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputes'] });
      toast({
        title: "Mediation scheduled",
        description: "The mediation session has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error scheduling mediation",
        description: "Failed to schedule mediation session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-yellow-100 text-yellow-800",
      "in_mediation": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      escalated: "bg-red-100 text-red-800"
    };

    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <Card key={dispute.id} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Raised by {dispute.raised_by.email}
                </Badge>
                <Badge variant="outline">
                  Against {dispute.against.email}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(dispute.created_at), 'PPP')}
              </p>
              <p className="mt-2">{dispute.description}</p>
              {dispute.mediator && (
                <p className="text-sm text-muted-foreground">
                  Mediator: {dispute.mediator.email}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-sm font-medium capitalize px-2 py-1 rounded-full ${getStatusBadge(dispute.status)}`}>
                {dispute.status.replace('_', ' ')}
              </span>
              {dispute.status === 'open' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDispute(dispute.id)}
                    >
                      Schedule Mediation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Mediation Session</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (selectedDate && selectedDispute) {
                          scheduleMediationMutation.mutate({
                            disputeId: selectedDispute,
                            date: selectedDate
                          });
                        }
                      }}
                      disabled={!selectedDate}
                    >
                      Confirm Mediation
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
          {dispute.mediation_sessions && dispute.mediation_sessions.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Mediation Sessions</h4>
              <div className="space-y-2">
                {dispute.mediation_sessions.map((session) => (
                  <div key={session.id} className="flex justify-between items-center text-sm">
                    <span>{format(new Date(session.scheduled_date), 'PPP p')}</span>
                    <Badge>{session.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}