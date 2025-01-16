import { Calendar } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { ResourceAllocationManager } from "@/components/contractor/allocation/ResourceAllocationManager";

interface SchedulingSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function SchedulingSection({ 
  contractorId, 
  activeSection, 
  setActiveSection 
}: SchedulingSectionProps) {
  return (
    <DashboardCard
      title="Resource & Schedule Manager"
      description="Manage your resource allocations, availability, and work schedule."
      icon={Calendar}
      buttonText={activeSection === 'scheduling' ? 'Close Schedule' : 'Manage Schedule'}
      onClick={() => setActiveSection(activeSection === 'scheduling' ? null : 'scheduling')}
      expanded={activeSection === 'scheduling'}
    >
      {activeSection === 'scheduling' && <ResourceAllocationManager contractorId={contractorId} />}
    </DashboardCard>
  );
}