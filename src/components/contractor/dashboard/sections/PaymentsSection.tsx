import { DollarSign } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { PaymentMilestones } from "@/components/contractor/payments/PaymentMilestones";

interface PaymentsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function PaymentsSection({
  contractorId,
  activeSection,
  setActiveSection,
}: PaymentsSectionProps) {
  return (
    <DashboardCard
      title="Payments & Invoicing"
      description="Track payments, manage invoices, and monitor financial milestones."
      icon={DollarSign}
      buttonText={activeSection === "payments" ? "Close Payments" : "Manage Payments"}
      onClick={() => setActiveSection(activeSection === "payments" ? null : "payments")}
      expanded={activeSection === "payments"}
    >
      {activeSection === "payments" && (
        <PaymentMilestones 
          contractorId={contractorId} 
          // TODO: Replace with actual project ID selection
          projectId="test-project-id"
        />
      )}
    </DashboardCard>
  );
}