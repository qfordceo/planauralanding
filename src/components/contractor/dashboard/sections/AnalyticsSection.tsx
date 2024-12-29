import { BarChart } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { AdvancedAnalytics } from "@/components/contractor/analytics/AdvancedAnalytics";

interface AnalyticsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function AnalyticsSection({ 
  contractorId, 
  activeSection, 
  setActiveSection 
}: AnalyticsSectionProps) {
  return (
    <DashboardCard
      title="Advanced Analytics"
      description="View detailed project metrics, timelines, and performance insights."
      icon={BarChart}
      buttonText={activeSection === 'analytics' ? 'Close Analytics' : 'View Analytics'}
      onClick={() => setActiveSection(activeSection === 'analytics' ? null : 'analytics')}
      expanded={activeSection === 'analytics'}
      aiData={{
        projectMetrics: true,
        bottlenecks: true,
        performance: true
      }}
      aiSection="analytics"
    >
      {activeSection === 'analytics' && <AdvancedAnalytics contractorId={contractorId} />}
    </DashboardCard>
  );
}