import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { TimelineEventContent } from "./components/TimelineEventContent";
import { getStatusColor } from "./utils/statusColors";
import type { ProjectTask, Milestone, TimelineEvent, TimelineResource, TaskStatus } from "./types";

interface GanttTimelineProps {
  projectId: string;
}

export function GanttTimeline({ projectId }: GanttTimelineProps) {
  const { data: tasks } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          id,
          title,
          status,
          start_date,
          due_date,
          assigned_contractor_id,
          contractors:assigned_contractor_id (
            id,
            business_name
          )
        `)
        .eq('project_id', projectId)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as ProjectTask[];
    }
  });

  const { data: milestones } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('id, title, due_date, status')
        .eq('build_estimate_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as Milestone[];
    }
  });

  const events: TimelineEvent[] = [
    ...(tasks?.map(task => ({
      id: task.id,
      title: task.title,
      start: task.start_date,
      end: task.due_date,
      backgroundColor: getStatusColor(task.status as TaskStatus),
      extendedProps: {
        contractor: task.contractors?.[0]?.business_name || '',
        status: task.status as TaskStatus
      }
    })) || []),
    ...(milestones?.map(milestone => ({
      id: milestone.id,
      title: milestone.title,
      start: milestone.due_date,
      end: milestone.due_date,
      backgroundColor: '#8b5cf6', // violet-500 for milestones
      extendedProps: {
        contractor: '',
        status: 'not_started' as TaskStatus // Default status for milestones
      }
    })) || [])
  ];

  const resources: TimelineResource[] = [
    { id: 'tasks', title: 'Tasks' },
    { id: 'milestones', title: 'Milestones' }
  ];

  return (
    <div className="h-[600px] bg-background">
      <FullCalendar
        plugins={[resourceTimelinePlugin]}
        initialView="resourceTimelineMonth"
        events={events}
        resources={resources}
        eventContent={TimelineEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
        }}
        resourceAreaWidth="15%"
        height="100%"
        slotMinWidth={100}
      />
    </div>
  );
}