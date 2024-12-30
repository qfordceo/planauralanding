import { Contractor } from "@/types/contractor";
import { DashboardHeader } from "../DashboardHeader";
import { DashboardGrid } from "./DashboardGrid";
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