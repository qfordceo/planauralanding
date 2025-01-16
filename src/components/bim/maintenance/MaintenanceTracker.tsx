import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Bell, Wrench, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface MaintenanceTrackerProps {
  modelId: string;
}

export function MaintenanceTracker({ modelId }: MaintenanceTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSchedule, setNewSchedule] = useState({
    componentName: "",
    maintenanceType: "",
    frequencyDays: 30,
  });

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['maintenance-schedules', modelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select(`
          *,
          maintenance_logs (*)
        `)
        .eq('bim_model_id', modelId)
        .order('next_maintenance_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createSchedule = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('maintenance_schedules')
        .insert([{
          bim_model_id: modelId,
          component_name: newSchedule.componentName,
          maintenance_type: newSchedule.maintenanceType,
          frequency_days: newSchedule.frequencyDays,
          next_maintenance_date: new Date(Date.now() + newSchedule.frequencyDays * 24 * 60 * 60 * 1000),
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      toast({
        title: "Schedule created",
        description: "New maintenance schedule has been created successfully.",
      });
      setNewSchedule({
        componentName: "",
        maintenanceType: "",
        frequencyDays: 30,
      });
    },
  });

  const logMaintenance = useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase
        .from('maintenance_logs')
        .insert([{
          schedule_id: scheduleId,
          maintenance_date: new Date().toISOString(),
        }]);

      if (error) throw error;

      const { error: updateError } = await supabase
        .from('maintenance_schedules')
        .update({
          last_maintenance_date: new Date().toISOString(),
          next_maintenance_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .eq('id', scheduleId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      toast({
        title: "Maintenance logged",
        description: "Maintenance has been recorded successfully.",
      });
    },
  });

  if (isLoading) {
    return <div>Loading maintenance schedules...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Maintenance Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add new schedule form */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-medium">Add New Schedule</h3>
            <div className="grid gap-4">
              <Input
                placeholder="Component name"
                value={newSchedule.componentName}
                onChange={(e) => setNewSchedule(prev => ({
                  ...prev,
                  componentName: e.target.value
                }))}
              />
              <Input
                placeholder="Maintenance type"
                value={newSchedule.maintenanceType}
                onChange={(e) => setNewSchedule(prev => ({
                  ...prev,
                  maintenanceType: e.target.value
                }))}
              />
              <Input
                type="number"
                placeholder="Frequency (days)"
                value={newSchedule.frequencyDays}
                onChange={(e) => setNewSchedule(prev => ({
                  ...prev,
                  frequencyDays: parseInt(e.target.value)
                }))}
              />
              <Button onClick={() => createSchedule.mutate()}>
                Add Schedule
              </Button>
            </div>
          </div>

          {/* Maintenance schedules list */}
          <div className="space-y-4">
            {schedules?.map((schedule) => (
              <Card key={schedule.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{schedule.component_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {schedule.maintenance_type}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Next: {format(new Date(schedule.next_maintenance_date), 'PPP')}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logMaintenance.mutate(schedule.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Log Maintenance
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}