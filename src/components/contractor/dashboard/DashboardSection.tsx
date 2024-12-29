import { Contractor } from "@/types/contractor";
import { ComponentType } from "react";

interface SectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  outbidCount?: number;
  defectCount?: number;
}

interface DashboardSectionProps {
  Section: ComponentType<SectionProps>;
  contractor: Contractor;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  outbidCount: number;
  defectCount: number;
}

export function DashboardSection({
  Section,
  contractor,
  activeSection,
  setActiveSection,
  outbidCount,
  defectCount,
}: DashboardSectionProps) {
  return (
    <Section
      contractorId={contractor.id}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      outbidCount={outbidCount}
      defectCount={defectCount}
    />
  );
}