import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DelayIndicatorProps {
  milestones: any[];
  agreedCompletionDate: string;
}

export function DelayIndicator({ milestones, agreedCompletionDate }: DelayIndicatorProps) {
  const calculateDelay = () => {
    const delayedMilestones = milestones.filter(
      milestone => 
        milestone.status !== 'completed' && 
        new Date(milestone.due_date) < new Date()
    );

    const totalDelay = delayedMilestones.length;
    const criticalDelay = delayedMilestones.filter(
      m => new Date(m.due_date).getTime() + (7 * 24 * 60 * 60 * 1000) < new Date().getTime()
    ).length;

    return {
      total: totalDelay,
      critical: criticalDelay,
      milestones: delayedMilestones
    };
  };

  const delay = calculateDelay();

  if (delay.total === 0) {
    return (
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>On Track</AlertTitle>
        <AlertDescription>
          Project is currently running according to schedule.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant={delay.critical > 0 ? "destructive" : "default"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Timeline Delays Detected</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p>{delay.total} milestone(s) behind schedule</p>
          {delay.critical > 0 && (
            <p className="font-semibold">
              {delay.critical} milestone(s) critically delayed
            </p>
          )}
          <div className="mt-4 space-y-2">
            {delay.milestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between">
                <span>{milestone.title}</span>
                <Badge variant={
                  new Date(milestone.due_date).getTime() + (7 * 24 * 60 * 60 * 1000) < new Date().getTime()
                    ? "destructive"
                    : "default"
                }>
                  {Math.ceil((new Date().getTime() - new Date(milestone.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}