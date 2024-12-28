import { Bug } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { DefectTracker } from "@/components/contractor/DefectTracker";

interface DefectsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  defectCount: number;
}

export function DefectsSection({ contractorId, activeSection, setActiveSection, defectCount }: DefectsSectionProps) {
  return (
    <DashboardCard
      title="Inspection Defects"
      description="Track and manage inspection defects."
      icon={Bug}
      buttonText={activeSection === 'defects' ? 'Close Defects' : 'View Defects'}
      onClick={() => setActiveSection(activeSection === 'defects' ? null : 'defects')}
      expanded={activeSection === 'defects'}
      badge={defectCount > 0 ? { count: defectCount, variant: "warning" } : undefined}
    >
      {activeSection === 'defects' && <DefectTracker contractorId={contractorId} />}
    </DashboardCard>
  );
}