import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { TimelineEventContent } from "./components/TimelineEventContent";
import { getStatusColor, getPhaseColor } from "./utils/statusColors";
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
          phase,
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
        .select('id, title, due_date, status, phase')
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
      backgroundColor: getPhaseColor(task.phase),
      borderColor: getStatusColor(task.status as TaskStatus),
      extendedProps: {
        contractor: task.contractors?.[0]?.business_name || '',
        status: task.status as TaskStatus,
        phase: task.phase
      }
    })) || []),
    ...(milestones?.map(milestone => ({
      id: milestone.id,
      title: milestone.title,
      start: milestone.due_date,
      end: milestone.due_date,
      backgroundColor: getPhaseColor(milestone.phase),
      display: 'background',
      extendedProps: {
        type: 'milestone',
        status: milestone.status,
        phase: milestone.phase
      }
    })) || [])
  ];

  const resources: TimelineResource[] = [
    { id: 'planning', title: 'Planning Phase' },
    { id: 'foundation', title: 'Foundation' },
    { id: 'framing', title: 'Framing' },
    { id: 'mechanical', title: 'Mechanical' },
    { id: 'finishing', title: 'Finishing' },
    { id: 'inspection', title: 'Inspection' }
  ];

  return (
    <div className="h-[600px] bg-background rounded-lg border">
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
        resourceGroupField="phase"
        resourceAreaHeaderContent="Project Phases"
        eventDidMount={(info) => {
          // Add tooltips
          if (info.event.extendedProps.type !== 'milestone') {
            const tooltip = document.createElement('div');
            tooltip.className = 'bg-background p-2 rounded shadow-lg border text-sm';
            tooltip.innerHTML = `
              <div class="font-medium">${info.event.title}</div>
              <div class="text-muted-foreground">
                Phase: ${info.event.extendedProps.phase}<br>
                Status: ${info.event.extendedProps.status}<br>
                ${info.event.extendedProps.contractor ? `Assigned to: ${info.event.extendedProps.contractor}` : ''}
              </div>
            `;
            info.el.title = "";
            new window.Tooltip(info.el, {
              title: tooltip.outerHTML,
              html: true,
              placement: 'top',
              trigger: 'hover',
              container: 'body'
            });
          }
        }}
      />
    </div>
  );
}