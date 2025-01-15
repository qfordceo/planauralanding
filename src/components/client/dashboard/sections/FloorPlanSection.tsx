import { DashboardCard } from "@/components/contractor/DashboardCard";
import { SavedFloorPlans } from "@/components/client/SavedFloorPlans";
import { Home } from "lucide-react";

interface FloorPlanSectionProps {
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function FloorPlanSection({ activeSection, setActiveSection }: FloorPlanSectionProps) {
  return (
    <DashboardCard
      title="Saved Floor Plans"
      description="View and manage your saved floor plans"
      icon={Home}
      buttonText={activeSection === 'floor-plans' ? 'Close Floor Plans' : 'View Floor Plans'}
      onClick={() => setActiveSection(activeSection === 'floor-plans' ? null : 'floor-plans')}
      expanded={activeSection === 'floor-plans'}
    >
      {activeSection === 'floor-plans' && <SavedFloorPlans />}
    </DashboardCard>
  );
}