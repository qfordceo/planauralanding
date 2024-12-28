import { PaymentsSection } from "./sections/PaymentsSection";
import { JobsSection } from "./sections/JobsSection";
import { DefectsSection } from "./sections/DefectsSection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { RebidSection } from "./sections/RebidSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { ReviewsSection } from "./sections/ReviewsSection";
import type { Contractor } from "@/types/contractor";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PaymentsSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      
      <JobsSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <NotificationsSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        outbidCount={outbidCount}
      />

      <RebidSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <DefectsSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        defectCount={defectCount}
      />

      <PortfolioSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <ReviewsSection
        contractorId={contractor.id}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}