import { ArrowUpDown } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { RebidManager } from "@/components/contractor/RebidManager";

interface RebidSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function RebidSection({ contractorId, activeSection, setActiveSection }: RebidSectionProps) {
  return (
    <DashboardCard
      title="Re-bid Projects"
      description="Review and update bids for projects where you've been outbid."
      icon={ArrowUpDown}
      buttonText={activeSection === 'rebid' ? 'Close Re-bid' : 'Manage Re-bids'}
      onClick={() => setActiveSection(activeSection === 'rebid' ? null : 'rebid')}
      expanded={activeSection === 'rebid'}
    >
      {activeSection === 'rebid' && <RebidManager contractorId={contractorId} />}
    </DashboardCard>
  );
}