import { CreditCard } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { PaymentSettings } from "@/components/contractor/payments/PaymentSettings";
import { PaymentHistory } from "@/components/contractor/payments/PaymentHistory";

interface PaymentsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function PaymentsSection({ contractorId, activeSection, setActiveSection }: PaymentsSectionProps) {
  return (
    <DashboardCard
      title="Payments"
      description="Manage your payment settings and view payment history."
      icon={CreditCard}
      buttonText={activeSection === 'payments' ? 'Close Payments' : 'View Payments'}
      onClick={() => setActiveSection(activeSection === 'payments' ? null : 'payments')}
      expanded={activeSection === 'payments'}
    >
      {activeSection === 'payments' && (
        <div className="space-y-6">
          <PaymentSettings contractorId={contractorId} />
          <PaymentHistory contractorId={contractorId} />
        </div>
      )}
    </DashboardCard>
  );
}