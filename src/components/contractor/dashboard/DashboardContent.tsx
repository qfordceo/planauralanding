import { Briefcase, Calendar, Star, Bell, Bug, ArrowUpDown, CreditCard } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { PortfolioManager } from "@/components/contractor/PortfolioManager";
import { ContractorReviews } from "@/components/contractor/ContractorReviews";
import { BidNotifications } from "@/components/contractor/BidNotifications";
import { DefectTracker } from "@/components/contractor/DefectTracker";
import { RebidManager } from "@/components/contractor/RebidManager";
import { AvailabilityManager } from "@/components/contractor/availability/AvailabilityManager";
import { PaymentSettings } from "@/components/contractor/payments/PaymentSettings";
import { PaymentHistory } from "@/components/contractor/payments/PaymentHistory";
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
      <DashboardCard
        title="Portfolio"
        description="Showcase your best work and completed projects."
        icon={Briefcase}
        buttonText={activeSection === 'portfolio' ? 'Close Portfolio' : 'Manage Portfolio'}
        onClick={() => setActiveSection(activeSection === 'portfolio' ? null : 'portfolio')}
        expanded={activeSection === 'portfolio'}
      >
        {activeSection === 'portfolio' && <PortfolioManager contractorId={contractor.id} />}
      </DashboardCard>

      <DashboardCard
        title="Reviews & Ratings"
        description="View your client reviews and overall rating."
        icon={Star}
        buttonText={activeSection === 'reviews' ? 'Close Reviews' : 'View Reviews'}
        onClick={() => setActiveSection(activeSection === 'reviews' ? null : 'reviews')}
        expanded={activeSection === 'reviews'}
      >
        {activeSection === 'reviews' && <ContractorReviews contractorId={contractor.id} />}
      </DashboardCard>

      <DashboardCard
        title="Bid Notifications"
        description="Check your bid status and notifications."
        icon={Bell}
        buttonText={activeSection === 'notifications' ? 'Close Notifications' : 'View Notifications'}
        onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
        expanded={activeSection === 'notifications'}
        badge={outbidCount > 0 ? { count: outbidCount, variant: "destructive" } : undefined}
      >
        {activeSection === 'notifications' && <BidNotifications contractorId={contractor.id} />}
      </DashboardCard>

      <DashboardCard
        title="Inspection Defects"
        description="Track and manage inspection defects."
        icon={Bug}
        buttonText={activeSection === 'defects' ? 'Close Defects' : 'View Defects'}
        onClick={() => setActiveSection(activeSection === 'defects' ? null : 'defects')}
        expanded={activeSection === 'defects'}
        badge={defectCount > 0 ? { count: defectCount, variant: "warning" } : undefined}
      >
        {activeSection === 'defects' && <DefectTracker contractorId={contractor.id} />}
      </DashboardCard>

      <DashboardCard
        title="Re-bid Projects"
        description="Review and update bids for projects where you've been outbid."
        icon={ArrowUpDown}
        buttonText={activeSection === 'rebid' ? 'Close Re-bid' : 'Manage Re-bids'}
        onClick={() => setActiveSection(activeSection === 'rebid' ? null : 'rebid')}
        expanded={activeSection === 'rebid'}
      >
        {activeSection === 'rebid' && <RebidManager contractorId={contractor.id} />}
      </DashboardCard>

      <DashboardCard
        title="Availability"
        description="Set your working hours and manage appointments."
        icon={Calendar}
        buttonText={activeSection === 'availability' ? 'Close Availability' : 'Set Availability'}
        onClick={() => setActiveSection(activeSection === 'availability' ? null : 'availability')}
        expanded={activeSection === 'availability'}
      >
        {activeSection === 'availability' && contractor && (
          <AvailabilityManager contractorId={contractor.id} />
        )}
      </DashboardCard>

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
            <PaymentSettings contractorId={contractor.id} />
            <PaymentHistory contractorId={contractor.id} />
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
