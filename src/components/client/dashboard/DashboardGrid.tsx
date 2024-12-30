import { DashboardCard } from "@/components/contractor/DashboardCard";
import { SavedFloorPlans } from "@/components/client/SavedFloorPlans";
import { SavedLandPlots } from "@/components/client/SavedLandPlots";
import { BuildConsulting } from "@/components/client/BuildConsulting";
import { BuildCostCard } from "@/components/client/BuildCostCard";
import { ProjectTimeline } from "@/components/client/build-cost/ProjectTimeline";
import { MaterialsCard } from "@/components/client/MaterialsCard";
import { FloorPlanAnalyzer } from "@/components/floor-plans/FloorPlanAnalyzer";
import { Home, FileText, Wallet, HardHat, Construction, Palette } from "lucide-react";
import type { Profile } from "@/types/profile";
import type { BuildData } from "./types";

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

      <DashboardCard
        title="Project Timeline"
        description="Track your home building progress"
        icon={Construction}
        buttonText={activeSection === 'timeline' ? 'Close Timeline' : 'View Timeline'}
        onClick={() => setActiveSection(activeSection === 'timeline' ? null : 'timeline')}
        expanded={activeSection === 'timeline'}
      >
        {activeSection === 'timeline' && <ProjectTimeline />}
      </DashboardCard>

      <DashboardCard
        title="Materials Selection"
        description="Choose materials and colors for your home"
        icon={Palette}
        buttonText={activeSection === 'materials' ? 'Close Materials' : 'View Materials'}
        onClick={() => setActiveSection(activeSection === 'materials' ? null : 'materials')}
        expanded={activeSection === 'materials'}
      >
        {activeSection === 'materials' && activeBuild && (
          <MaterialsCard floorPlanId={activeBuild.floor_plan_id} />
        )}
      </DashboardCard>

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

      <DashboardCard
        title="Land Plots"
        description="Browse available land plots in your area"
        icon={FileText}
        buttonText={activeSection === 'land' ? 'Close Land Plots' : 'View Land Plots'}
        onClick={() => setActiveSection(activeSection === 'land' ? null : 'land')}
        expanded={activeSection === 'land'}
      >
        {activeSection === 'land' && <SavedLandPlots />}
      </DashboardCard>

      <DashboardCard
        title="Build Consulting"
        description="Get expert guidance on your build project"
        icon={HardHat}
        buttonText={activeSection === 'consulting' ? 'Close Consulting' : 'View Consulting'}
        onClick={() => setActiveSection(activeSection === 'consulting' ? null : 'consulting')}
        expanded={activeSection === 'consulting'}
      >
        {activeSection === 'consulting' && (
          <BuildConsulting 
            profile={profile} 
            floorPlanId={activeBuild?.floor_plan_id}
          />
        )}
      </DashboardCard>

      <DashboardCard
        title="Floor Plan Analysis"
        description="Analyze and customize floor plans"
        icon={Home}
        buttonText={activeSection === 'floor-plan-analysis' ? 'Close Analysis' : 'View Analysis'}
        onClick={() => setActiveSection(activeSection === 'floor-plan-analysis' ? null : 'floor-plan-analysis')}
        expanded={activeSection === 'floor-plan-analysis'}
      >
        {activeSection === 'floor-plan-analysis' && <FloorPlanAnalyzer />}
      </DashboardCard>
    </div>
  );
}
