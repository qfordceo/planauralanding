import { Search } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { AvailableJobs } from "@/components/contractor/jobs/AvailableJobs";

interface JobsSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function JobsSection({ contractorId, activeSection, setActiveSection }: JobsSectionProps) {
  return (
    <DashboardCard
      title="Available Jobs"
      description="Browse and bid on available projects in your area."
      icon={Search}
      buttonText={activeSection === 'jobs' ? 'Close Jobs' : 'View Jobs'}
      onClick={() => setActiveSection(activeSection === 'jobs' ? null : 'jobs')}
      expanded={activeSection === 'jobs'}
      visibility="public"
    >
      {activeSection === 'jobs' && <AvailableJobs contractorId={contractorId} />}
    </DashboardCard>
  );
}