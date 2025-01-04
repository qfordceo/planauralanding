import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface Milestone {
  id: string;
  title: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  completion_percentage: number;
}

export function MilestoneTracker({ contractorId }: { contractorId: string }) {
  const { data: milestones, isLoading } = useQuery({
    queryKey: ['contractor-milestones', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select(`
          id,
          title,
          due_date,
          status,
          completion_percentage
        `)
        .eq('assigned_contractor_id', contractorId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as Milestone[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return <div>Loading milestones...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Milestone Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {milestones?.map((milestone) => (
            <div key={milestone.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {milestone.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  <span className="font-medium">{milestone.title}</span>
                </div>
                <Badge className={getStatusColor(milestone.status)}>
                  {milestone.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(new Date(milestone.due_date), 'MMM d, yyyy')}
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{milestone.completion_percentage}%</span>
                </div>
                <Progress value={milestone.completion_percentage} className="h-2" />
              </div>

              {milestone.status === 'pending' && new Date(milestone.due_date) < new Date() && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <Bell className="h-4 w-4" />
                  <span>Past due date</span>
                </div>
              )}
            </div>
          ))}

          {!milestones?.length && (
            <div className="text-center text-muted-foreground">
              No milestones found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}