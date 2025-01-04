import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface MilestoneStatusProps {
  milestone: any;
  projectId: string;
}

export function MilestoneStatus({ milestone, projectId }: MilestoneStatusProps) {
  const getStatusDetails = () => {
    const now = new Date();
    const dueDate = new Date(milestone.due_date);
    const isOverdue = dueDate < now && milestone.status !== 'completed';
    const isCritical = dueDate.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime();

    return {
      isOverdue,
      isCritical,
      daysOverdue: isOverdue 
        ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0
    };
  };

  const { isOverdue, isCritical, daysOverdue } = getStatusDetails();

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {milestone.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : isOverdue ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-blue-500" />
            )}
            <h4 className="font-medium">{milestone.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Due: {format(new Date(milestone.due_date), 'PPP')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={
            milestone.status === 'completed' ? 'default' :
            isCritical ? 'destructive' :
            isOverdue ? 'secondary' : 'outline'
          }>
            {milestone.status === 'completed' ? 'Completed' :
             isOverdue ? `${daysOverdue} days overdue` : 'On track'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}