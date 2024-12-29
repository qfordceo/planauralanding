import { GraduationCap } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { TrainingHub } from "@/components/contractor/training/TrainingHub";

interface TrainingSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function TrainingSection({ contractorId, activeSection, setActiveSection }: TrainingSectionProps) {
  return (
    <DashboardCard
      title="Training & Development"
      description="Access training materials, certifications, and professional development resources"
      icon={GraduationCap}
      buttonText={activeSection === 'training' ? 'Close Training' : 'View Training'}
      onClick={() => setActiveSection(activeSection === 'training' ? null : 'training')}
      expanded={activeSection === 'training'}
      visibility="private"
    >
      {activeSection === 'training' && <TrainingHub />}
    </DashboardCard>
  );
}