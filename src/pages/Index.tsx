import { DashboardContainer } from "@/components/client/dashboard/DashboardContainer";
import { NotificationPreferences } from "@/components/client/NotificationPreferences";

export default function Index() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <DashboardContainer />
      <NotificationPreferences />
    </div>
  );
}