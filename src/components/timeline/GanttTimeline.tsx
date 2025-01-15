import { useQuery } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface GanttTimelineProps {
  projectId: string;
}

interface Contractor {
  business_name: string;
}

interface ProjectTask {
  id: string;
  title: string;
  status: string;
  start_date: string;
  due_date: string;
  assigned_contractor_id: string;
  contractors?: Contractor;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: string;
  project_tasks?: ProjectTask[];
}

export function GanttTimeline({ projectId }: GanttTimelineProps) {
  const { data: timelineData, isLoading } = useQuery({
    queryKey: ['project-timeline', projectId],
    queryFn: async () => {
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select(`
          id,
          title,
          description,
          due_date,
          status,
          project_tasks (
            id,
            title,
            status,
            start_date,
            due_date,
            assigned_contractor_id,
            contractors:assigned_contractor_id (
              business_name
            )
          )
        `)
        .eq('build_estimate_id', projectId)
        .order('due_date', { ascending: true });

      if (milestonesError) throw milestonesError;

      const resources = milestones?.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        children: milestone.project_tasks?.map(task => ({
          id: task.id,
          title: task.title,
          parentId: milestone.id
        }))
      })) || [];

      const events = milestones?.flatMap(milestone => 
        milestone.project_tasks?.map(task => ({
          id: task.id,
          resourceId: task.id,
          title: task.title,
          start: task.start_date,
          end: task.due_date,
          backgroundColor: getStatusColor(task.status),
          extendedProps: {
            contractor: task.contractors?.business_name,
            status: task.status
          }
        })) || []
      ) || [];

      return { resources, events };
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
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <FullCalendar
            plugins={[resourceTimelinePlugin]}
            initialView="resourceTimelineMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
            }}
            resources={timelineData?.resources}
            events={timelineData?.events}
            resourceAreaWidth="20%"
            slotMinWidth={100}
            resourceAreaHeaderContent="Project Phases"
            eventContent={(arg) => (
              <div className="p-1 text-xs">
                <div className="font-medium">{arg.event.title}</div>
                {arg.event.extendedProps.contractor && (
                  <div className="text-muted-foreground">
                    {arg.event.extendedProps.contractor}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e'; // green-500
    case 'in_progress':
      return '#3b82f6'; // blue-500
    case 'blocked':
      return '#ef4444'; // red-500
    case 'needs_review':
      return '#f59e0b'; // amber-500
    default:
      return '#94a3b8'; // slate-400
  }
}