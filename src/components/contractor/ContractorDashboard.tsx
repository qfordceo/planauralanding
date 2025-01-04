import { OnboardingProgress } from "./onboarding/OnboardingProgress";
import { ResourceLibrary } from "./education/ResourceLibrary";
import { Contractor } from "@/types/contractor";

interface ContractorDashboardProps {
  contractor: Contractor;
}

export function ContractorDashboard({ contractor }: ContractorDashboardProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <OnboardingProgress contractorId={contractor.id} />
      <ResourceLibrary />
    </div>
  );
}