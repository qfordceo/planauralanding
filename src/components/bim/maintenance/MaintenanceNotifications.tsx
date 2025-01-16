import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function MaintenanceNotifications() {
  const { toast } = useToast();

  const { data: notifications } = useQuery({
    queryKey: ['maintenance-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_activity_logs')
        .select('*')
        .eq('activity_type', 'maintenance_due')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    const channel = supabase
      .channel('maintenance-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_activity_logs',
          filter: `activity_type=eq.maintenance_due`,
        },
        (payload) => {
          const notification = payload.new;
          toast({
            title: "Maintenance Due",
            description: `${notification.activity_data.component_name} needs maintenance by ${format(new Date(notification.activity_data.due_date), 'PPP')}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Maintenance Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications?.map((notification) => (
            <Card key={notification.id} className="p-4">
              <div className="flex items-start gap-4">
                <Bell className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">
                    {notification.activity_data.component_name} Maintenance Due
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Due by: {format(new Date(notification.activity_data.due_date), 'PPP')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Type: {notification.activity_data.maintenance_type}
                  </p>
                </div>
              </div>
            </Card>
          ))}
          {!notifications?.length && (
            <p className="text-center text-muted-foreground">
              No maintenance tasks due soon
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}