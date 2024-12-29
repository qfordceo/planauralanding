import { DollarSign } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { ExpenseTracker } from "@/components/contractor/expenses/ExpenseTracker";

interface ExpenseSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function ExpenseSection({ contractorId, activeSection, setActiveSection }: ExpenseSectionProps) {
  return (
    <DashboardCard
      title="Expense Tracker"
      description="Track your business expenses, receipts, and financial reports."
      icon={DollarSign}
      buttonText={activeSection === 'expenses' ? 'Close Expenses' : 'Manage Expenses'}
      onClick={() => setActiveSection(activeSection === 'expenses' ? null : 'expenses')}
      expanded={activeSection === 'expenses'}
      visibility="private"
    >
      {activeSection === 'expenses' && <ExpenseTracker contractorId={contractorId} />}
    </DashboardCard>
  );
}