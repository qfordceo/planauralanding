import { Profile } from "@/types/profile";
import { BuildData } from "./types";
import { CostSection } from "./sections/CostSection";
import { CustomizationSection } from "./sections/CustomizationSection";
import { FloorPlanSection } from "./sections/FloorPlanSection";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { SavedFloorPlans } from "@/components/client/SavedFloorPlans";
import { Home } from "lucide-react";

interface DashboardGridProps {
  profile: Profile;
  activeBuild: BuildData | null;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function DashboardGrid({ 
  profile, 
  activeBuild, 
  activeSection, 
  setActiveSection 
}: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CostSection 
        activeBuild={activeBuild}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <CustomizationSection 
        activeBuild={activeBuild}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <FloorPlanSection 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
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
    </div>
  );
}
