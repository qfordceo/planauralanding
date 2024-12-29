import { Contractor } from "@/types/contractor";
import { DashboardGrid } from "./DashboardGrid";

interface DashboardContentProps {
  contractor: Contractor;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  outbidCount: number;
  defectCount: number;
}

export function DashboardContent({
  contractor,
  activeSection,
  setActiveSection,
  outbidCount,
  defectCount,
}: DashboardContentProps) {
  return (
    <DashboardGrid
      contractor={contractor}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      outbidCount={outbidCount}
      defectCount={defectCount}
    />
  );
}