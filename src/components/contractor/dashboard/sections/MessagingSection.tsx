import { MessageSquare } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { MessagingInterface } from "@/components/contractor/messaging/MessagingInterface";

interface MessagingSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  unreadCount: number;
}

export function MessagingSection({ 
  contractorId, 
  activeSection, 
  setActiveSection,
  unreadCount
}: MessagingSectionProps) {
  return (
    <DashboardCard
      title="Messages"
      description="Communicate with clients and team members"
      icon={MessageSquare}
      buttonText={activeSection === 'messaging' ? 'Close Messages' : 'View Messages'}
      onClick={() => setActiveSection(activeSection === 'messaging' ? null : 'messaging')}
      expanded={activeSection === 'messaging'}
      badge={unreadCount > 0 ? { count: unreadCount, variant: "default" } : undefined}
    >
      {activeSection === 'messaging' && <MessagingInterface contractorId={contractorId} />}
    </DashboardCard>
  );
}