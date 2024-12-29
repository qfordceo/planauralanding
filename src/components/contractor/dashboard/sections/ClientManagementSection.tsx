import { Users } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { ClientManager } from "@/components/contractor/clients/ClientManager";

interface ClientManagementSectionProps {
  contractorId: string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export function ClientManagementSection({ contractorId, activeSection, setActiveSection }: ClientManagementSectionProps) {
  return (
    <DashboardCard
      title="Client Management"
      description="Manage your client relationships, projects, and communications."
      icon={Users}
      buttonText={activeSection === 'clients' ? 'Close Clients' : 'Manage Clients'}
      onClick={() => setActiveSection(activeSection === 'clients' ? null : 'clients')}
      expanded={activeSection === 'clients'}
      visibility="private"
    >
      {activeSection === 'clients' && <ClientManager contractorId={contractorId} />}
    </DashboardCard>
  );
}