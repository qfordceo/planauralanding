import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ResourceAllocationManagerProps {
  contractorId: string;
}

export function ResourceAllocationManager({ contractorId }: ResourceAllocationManagerProps) {
  const queryClient = useQueryClient();
  const [resources, setResources] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Fetch contractor availability
  const { data: availability } = useQuery({
    queryKey: ["contractor-availability", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_availability")
        .select("*")
        .eq("contractor_id", contractorId);

      if (error) throw error;
      return data;
    },
  });

  // Fetch tasks that can be assigned
  const { data: tasks } = useQuery({
    queryKey: ["project-tasks", contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .is("assigned_contractor_id", null);

      if (error) throw error;
      return data;
    },
  });

  // Update task assignment
  const updateTaskAssignment = useMutation({
    mutationFn: async ({ taskId, contractorId, startDate, endDate }: any) => {
      const { error } = await supabase
        .from("project_tasks")
        .update({
          assigned_contractor_id: contractorId,
          start_date: startDate,
          due_date: endDate,
        })
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast.success("Task assigned successfully");
    },
    onError: (error) => {
      toast.error("Failed to assign task");
      console.error("Error assigning task:", error);
    },
  });

  // Transform availability data into FullCalendar resources
  useEffect(() => {
    if (availability) {
      const transformedResources = availability.map((slot: any) => ({
        id: slot.id,
        title: `Contractor ${slot.contractor_id}`,
        businessHours: {
          startTime: slot.start_time,
          endTime: slot.end_time,
          daysOfWeek: [slot.day_of_week],
        },
      }));
      setResources(transformedResources);
    }
  }, [availability]);

  // Transform tasks into FullCalendar events
  useEffect(() => {
    if (tasks) {
      const transformedEvents = tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        start: task.start_date,
        end: task.due_date,
        resourceId: task.assigned_contractor_id,
      }));
      setEvents(transformedEvents);
    }
  }, [tasks]);

  const handleEventDrop = async (info: any) => {
    const { event, resource } = info;
    
    // Check if the new time slot conflicts with contractor availability
    const isAvailable = availability?.some((slot: any) => 
      slot.contractor_id === resource.id &&
      new Date(event.start).getDay() === slot.day_of_week
    );

    if (!isAvailable) {
      toast.error("Contractor is not available at this time");
      info.revert();
      return;
    }

    try {
      await updateTaskAssignment.mutateAsync({
        taskId: event.id,
        contractorId: resource.id,
        startDate: event.start,
        endDate: event.end,
      });
    } catch (error) {
      info.revert();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimelineWeek"
          editable={true}
          droppable={true}
          resources={resources}
          events={events}
          eventDrop={handleEventDrop}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          businessHours={true}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
          }}
        />
      </CardContent>
    </Card>
  );
}