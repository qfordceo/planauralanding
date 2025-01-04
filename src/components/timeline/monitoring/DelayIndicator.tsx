import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
      milestones: delayedMilestones,
      overallStatus: criticalDelay > 0 ? 'critical' : totalDelay > 0 ? 'delayed' : 'on_track'
    };
  };

  useEffect(() => {
    const delay = calculateDelay();
    
    // Create delay notifications for critical delays
    const createDelayNotifications = async () => {
      if (delay.critical > 0) {
        for (const milestone of delay.milestones) {
          const daysOverdue = Math.ceil(
            (new Date().getTime() - new Date(milestone.due_date).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          if (daysOverdue >= 7) {
            await supabase
              .from('project_delay_notifications')
              .insert({
                project_id: milestone.build_estimate_id,
                milestone_id: milestone.id,
                delay_days: daysOverdue,
                severity: 'critical',
                status: 'pending',
                resolution_action: `Milestone "${milestone.title}" is critically delayed by ${daysOverdue} days. Immediate action required.`
              })
              .select()
              .single();
          }
        }
      }
    };

    createDelayNotifications();
  }, [milestones]);

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