import { BarChart } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { ProjectAnalytics } from "@/components/contractor/analytics/ProjectAnalytics";

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
      title="Project Analytics"
      description="View project metrics and performance insights."
      icon={BarChart}
      buttonText={activeSection === 'analytics' ? 'Close Analytics' : 'View Analytics'}
      onClick={() => setActiveSection(activeSection === 'analytics' ? null : 'analytics')}
      expanded={activeSection === 'analytics'}
    >
      {activeSection === 'analytics' && <ProjectAnalytics contractorId={contractorId} />}
    </DashboardCard>
  );
}