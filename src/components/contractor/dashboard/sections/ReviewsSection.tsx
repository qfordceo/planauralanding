import { Star } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { ContractorReviews } from "@/components/contractor/ContractorReviews";

interface ReviewsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function ReviewsSection({ contractorId, activeSection, setActiveSection }: ReviewsSectionProps) {
  return (
    <DashboardCard
      title="Reviews & Ratings"
      description="View your client reviews and overall rating."
      icon={Star}
      buttonText={activeSection === 'reviews' ? 'Close Reviews' : 'View Reviews'}
      onClick={() => setActiveSection(activeSection === 'reviews' ? null : 'reviews')}
      expanded={activeSection === 'reviews'}
      visibility="public"
    >
      {activeSection === 'reviews' && <ContractorReviews contractorId={contractorId} />}
    </DashboardCard>
  );
}