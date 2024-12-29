import { Contractor } from "@/types/contractor";
import { DashboardSection } from "./DashboardSection";
import { sections } from "./sections";

interface DashboardGridProps {
  contractor: Contractor;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  outbidCount: number;
  defectCount: number;
}

export function DashboardGrid({
  contractor,
  activeSection,
  setActiveSection,
  outbidCount,
  defectCount,
}: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((Section) => (
        <DashboardSection
          key={Section.name}
          Section={Section}
          contractor={contractor}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          outbidCount={outbidCount}
          defectCount={defectCount}
        />
      ))}
    </div>
  );
}