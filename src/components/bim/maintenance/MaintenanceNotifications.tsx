import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export function MaintenanceNotifications() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['maintenance-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_activity_logs')
        .select('*')
        .eq('activity_type', 'maintenance_due')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  if (!notifications?.length) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Maintenance Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50"
            >
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {notification.activity_data.component_name} - {notification.activity_data.maintenance_type}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {format(new Date(notification.activity_data.due_date), 'PPP')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}