import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DisputeListProps {
  disputes: any[];
  onScheduleMediation: (params: { disputeId: string, date: string }) => void;
  onAcceptResolution: (params: { sessionId: string, isClient: boolean }) => void;
}

export function DisputeList({ 
  disputes,
  onScheduleMediation,
  onAcceptResolution
}: DisputeListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {disputes.map((dispute) => (
        <Card key={dispute.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Badge className={getStatusColor(dispute.status)}>
                {dispute.status}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Raised by: {dispute.raised_by?.email}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(dispute.created_at), 'PPP')}
            </div>
          </div>

          <p className="mb-4">{dispute.description}</p>

          {dispute.mediation_sessions?.map((session: any) => (
            <div key={session.id} className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Mediation: {format(new Date(session.scheduled_date), 'PPP')}
                  </span>
                </div>
                <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                  {session.status}
                </Badge>
              </div>

              {session.resolution_proposal && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Proposed Resolution:</p>
                  <p className="text-sm text-muted-foreground">
                    {session.resolution_proposal}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {!session.client_accepted && (
                      <Button
                        size="sm"
                        onClick={() => onAcceptResolution({
                          sessionId: session.id,
                          isClient: true
                        })}
                      >
                        Accept as Client
                      </Button>
                    )}
                    {!session.contractor_accepted && (
                      <Button
                        size="sm"
                        onClick={() => onAcceptResolution({
                          sessionId: session.id,
                          isClient: false
                        })}
                      >
                        Accept as Contractor
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {dispute.status === 'open' && !dispute.mediation_sessions?.length && (
            <Button
              size="sm"
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                onScheduleMediation({
                  disputeId: dispute.id,
                  date: date.toISOString()
                });
              }}
            >
              Schedule Mediation
            </Button>
          )}
        </Card>
      ))}

      {disputes.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No disputes found
        </p>
      )}
    </div>
  );
}