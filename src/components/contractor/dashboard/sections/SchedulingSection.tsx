import { Calendar } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { AvailabilityManager } from "@/components/contractor/availability/AvailabilityManager";

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
      title="Schedule Manager"
      description="Manage your availability, appointments, and work schedule."
      icon={Calendar}
      buttonText={activeSection === 'scheduling' ? 'Close Schedule' : 'Manage Schedule'}
      onClick={() => setActiveSection(activeSection === 'scheduling' ? null : 'scheduling')}
      expanded={activeSection === 'scheduling'}
    >
      {activeSection === 'scheduling' && <AvailabilityManager contractorId={contractorId} />}
    </DashboardCard>
  );
}