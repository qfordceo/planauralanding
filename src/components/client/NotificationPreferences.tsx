import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function NotificationPreferences() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const {
    preferences,
    isLoading,
    updatePreferences,
    isUpdating
  } = useNotificationPreferences(user?.id || '');

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences?.email_notifications}
              onCheckedChange={(checked) =>
                updatePreferences({ email_notifications: checked })
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch
              id="sms-notifications"
              checked={preferences?.sms_notifications}
              onCheckedChange={(checked) =>
                updatePreferences({ sms_notifications: checked })
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="project-updates">Project Updates</Label>
            <Switch
              id="project-updates"
              checked={preferences?.project_updates}
              onCheckedChange={(checked) =>
                updatePreferences({ project_updates: checked })
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="contract-updates">Contract Updates</Label>
            <Switch
              id="contract-updates"
              checked={preferences?.contract_updates}
              onCheckedChange={(checked) =>
                updatePreferences({ contract_updates: checked })
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="payment-updates">Payment Updates</Label>
            <Switch
              id="payment-updates"
              checked={preferences?.payment_updates}
              onCheckedChange={(checked) =>
                updatePreferences({ payment_updates: checked })
              }
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="milestone-updates">Milestone Updates</Label>
            <Switch
              id="milestone-updates"
              checked={preferences?.milestone_updates}
              onCheckedChange={(checked) =>
                updatePreferences({ milestone_updates: checked })
              }
              disabled={isUpdating}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}