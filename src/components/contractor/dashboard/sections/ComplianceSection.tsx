import { FileCheck } from "lucide-react";
import { DashboardCard } from "../../DashboardCard";
import { ComplianceDocuments } from "../../compliance/ComplianceDocuments";

interface ComplianceSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function ComplianceSection({
  contractorId,
  activeSection,
  setActiveSection,
}: ComplianceSectionProps) {
  const isActive = activeSection === "compliance";

  return (
    <DashboardCard
      title="Compliance & Documentation"
      description="Manage your licenses, certifications, and other compliance documents."
      icon={FileCheck}
      buttonText={isActive ? "Close" : "Manage Documents"}
      onClick={() => setActiveSection(isActive ? null : "compliance")}
      expanded={isActive}
    >
      <ComplianceDocuments contractorId={contractorId} />
    </DashboardCard>
  );
}