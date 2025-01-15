import { DashboardCard } from "@/components/contractor/DashboardCard";
import { BuildCostCard } from "@/components/client/BuildCostCard";
import { Wallet } from "lucide-react";
import type { BuildData } from "../types";

interface CostSectionProps {
  activeBuild: BuildData | null;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function CostSection({ activeBuild, activeSection, setActiveSection }: CostSectionProps) {
  return (
    <DashboardCard
      title="Build Cost Analysis"
      description="View and manage your build costs"
      icon={Wallet}
      buttonText={activeSection === 'costs' ? 'Close Analysis' : 'View Analysis'}
      onClick={() => setActiveSection(activeSection === 'costs' ? null : 'costs')}
      expanded={activeSection === 'costs'}
    >
      {activeSection === 'costs' && activeBuild && (
        <BuildCostCard 
          floorPlanId={activeBuild.floor_plan_id} 
          landListingId={activeBuild.land_listing_id}
          landCost={activeBuild.land_cost}
        />
      )}
    </DashboardCard>
  );
}