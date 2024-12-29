import { Button } from "@/components/ui/button";
import { Calendar, Trash, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { PaymentMilestone } from "@/types/payments";
import { Badge } from "@/components/ui/badge";

interface MilestoneListProps {
  milestones: PaymentMilestone[];
  onStatusUpdate: (data: { id: string; status: string; completedDate?: string }) => void;
  onDelete: (id: string) => void;
  isValidating: boolean;
}

export function MilestoneList({ milestones, onStatusUpdate, onDelete, isValidating }: MilestoneListProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPp");
  };

  const handleStatusToggle = (milestone: PaymentMilestone) => {
    if (milestone.status === "completed") {
      onStatusUpdate({ id: milestone.id, status: "pending" });
    } else {
      onStatusUpdate({
        id: milestone.id,
        status: "completed",
        completedDate: new Date().toISOString(),
      });
    }
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case 'funded':
        return 'bg-blue-100 text-blue-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="p-4 border rounded-lg flex justify-between items-start"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{milestone.title}</h3>
              <Badge variant={milestone.status === "completed" ? "secondary" : "outline"}>
                {milestone.status}
              </Badge>
              <Badge className={getEscrowStatusColor(milestone.escrow_status)}>
                {milestone.escrow_status}
              </Badge>
            </div>
            <p className="text-lg font-medium text-green-600">
              ${milestone.amount.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Due: {milestone.due_date ? formatDate(milestone.due_date) : 'Not set'}
            </p>
            {milestone.completed_date && (
              <p className="text-sm text-muted-foreground">
                Completed: {formatDate(milestone.completed_date)}
              </p>
            )}
            {milestone.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {milestone.description}
              </p>
            )}
            {milestone.dispute_reason && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="h-4 w-4" />
                Dispute: {milestone.dispute_reason}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStatusToggle(milestone)}
              disabled={isValidating}
            >
              {milestone.status === "completed" ? (
                <XCircle className="h-4 w-4 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(milestone.id)}
              disabled={isValidating}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}