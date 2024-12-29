import { Package } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { MaterialManager } from "@/components/contractor/materials/MaterialManager";

interface MaterialManagementSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function MaterialManagementSection({ 
  contractorId, 
  activeSection, 
  setActiveSection 
}: MaterialManagementSectionProps) {
  return (
    <DashboardCard
      title="Material Management"
      description="Track inventory, orders, and suppliers."
      icon={Package}
      buttonText={activeSection === 'materials' ? 'Close Materials' : 'View Materials'}
      onClick={() => setActiveSection(activeSection === 'materials' ? null : 'materials')}
      expanded={activeSection === 'materials'}
    >
      {activeSection === 'materials' && <MaterialManager contractorId={contractorId} />}
    </DashboardCard>
  );
}