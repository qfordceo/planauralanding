import { Users } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { WorkforceManager } from "@/components/contractor/workforce/WorkforceManager";

interface WorkforceSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function WorkforceSection({ 
  contractorId, 
  activeSection, 
  setActiveSection 
}: WorkforceSectionProps) {
  return (
    <DashboardCard
      title="Workforce Management"
      description="Manage workers, assignments, and schedules."
      icon={Users}
      buttonText={activeSection === 'workforce' ? 'Close Workforce' : 'View Workforce'}
      onClick={() => setActiveSection(activeSection === 'workforce' ? null : 'workforce')}
      expanded={activeSection === 'workforce'}
    >
      {activeSection === 'workforce' && <WorkforceManager contractorId={contractorId} />}
    </DashboardCard>
  );
}