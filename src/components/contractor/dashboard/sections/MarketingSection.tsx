import { Megaphone } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { MarketingHub } from "@/components/contractor/marketing/MarketingHub";

interface MarketingSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function MarketingSection({ 
  contractorId, 
  activeSection, 
  setActiveSection 
}: MarketingSectionProps) {
  return (
    <DashboardCard
      title="Marketing Hub"
      description="Manage your online presence, promotions, and lead generation."
      icon={Megaphone}
      buttonText={activeSection === 'marketing' ? 'Close Marketing' : 'Marketing Hub'}
      onClick={() => setActiveSection(activeSection === 'marketing' ? null : 'marketing')}
      expanded={activeSection === 'marketing'}
    >
      {activeSection === 'marketing' && <MarketingHub contractorId={contractorId} />}
    </DashboardCard>
  );
}