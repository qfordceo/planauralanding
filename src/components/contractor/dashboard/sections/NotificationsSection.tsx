import { Bell } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { BidNotifications } from "@/components/contractor/BidNotifications";

interface NotificationsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  outbidCount: number;
}

export function NotificationsSection({ contractorId, activeSection, setActiveSection, outbidCount }: NotificationsSectionProps) {
  return (
    <DashboardCard
      title="Bid Notifications"
      description="Check your bid status and notifications."
      icon={Bell}
      buttonText={activeSection === 'notifications' ? 'Close Notifications' : 'View Notifications'}
      onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
      expanded={activeSection === 'notifications'}
      badge={outbidCount > 0 ? { count: outbidCount, variant: "destructive" } : undefined}
    >
      {activeSection === 'notifications' && <BidNotifications contractorId={contractorId} />}
    </DashboardCard>
  );
}