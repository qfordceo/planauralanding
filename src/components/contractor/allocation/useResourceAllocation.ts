import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Resource, Event } from "./types";

export function useResourceAllocation(contractorId: string) {
  const queryClient = useQueryClient();
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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

  return {
    resources,
    events,
    availability,
    updateTaskAssignment,
  };
}