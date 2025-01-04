import { Contractor } from "@/types/contractor";
import { DashboardHeader } from "../DashboardHeader";
import { DashboardGrid } from "./DashboardGrid";
import { TaskManagement } from "../tasks/TaskManagement";
import { MilestoneTracker } from "../milestones/MilestoneTracker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <DashboardHeader 
          contractor={contractor} 
          onSignOut={() => {}} // You'll need to implement this
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TaskManagement contractorId={contractor.id} />
          <MilestoneTracker contractorId={contractor.id} />
        </div>

        <DashboardGrid
          contractor={contractor}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          outbidCount={outbidCount}
          defectCount={defectCount}
        />
      </div>
    </QueryClientProvider>
  );
}