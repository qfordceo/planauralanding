import { Contractor } from "@/types/contractor";
import { DashboardSection } from "./DashboardSection";
import { sections } from "./sections";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className={`grid gap-4 ${
      isMobile 
        ? 'grid-cols-1' 
        : activeSection 
          ? 'grid-cols-1 md:grid-cols-2' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
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