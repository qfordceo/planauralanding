import { DashboardCard } from "@/components/contractor/DashboardCard";
import { CustomizationPanel } from "@/components/client/customization/CustomizationPanel";
import { Palette } from "lucide-react";
import type { BuildData } from "../types";

interface CustomizationSectionProps {
  activeBuild: BuildData | null;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function CustomizationSection({ activeBuild, activeSection, setActiveSection }: CustomizationSectionProps) {
  return (
    <DashboardCard
      title="Customize Your Home"
      description="Customize your floor plan, materials, and finishes with real-time budget updates"
      icon={Palette}
      buttonText={activeSection === 'customize' ? 'Close Customization' : 'Customize'}
      onClick={() => setActiveSection(activeSection === 'customize' ? null : 'customize')}
      expanded={activeSection === 'customize'}
    >
      {activeSection === 'customize' && activeBuild && (
        <CustomizationPanel floorPlanId={activeBuild.floor_plan_id} />
      )}
    </DashboardCard>
  );
}