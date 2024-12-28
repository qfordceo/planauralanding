import { Briefcase } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { PortfolioManager } from "@/components/contractor/PortfolioManager";

interface PortfolioSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function PortfolioSection({ contractorId, activeSection, setActiveSection }: PortfolioSectionProps) {
  return (
    <DashboardCard
      title="Portfolio"
      description="Showcase your best work and completed projects."
      icon={Briefcase}
      buttonText={activeSection === 'portfolio' ? 'Close Portfolio' : 'Manage Portfolio'}
      onClick={() => setActiveSection(activeSection === 'portfolio' ? null : 'portfolio')}
      expanded={activeSection === 'portfolio'}
    >
      {activeSection === 'portfolio' && <PortfolioManager contractorId={contractorId} />}
    </DashboardCard>
  );
}