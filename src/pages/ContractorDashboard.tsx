import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/components/contractor/DashboardHeader";
import { RegistrationForm } from "@/components/contractor/RegistrationForm";
import { DashboardContent } from "@/components/contractor/dashboard/DashboardContent";
import { useDashboardState } from "@/components/contractor/dashboard/DashboardState";
import { useContractorData } from "@/components/contractor/dashboard/useContractorData";
import { useNotifications } from "@/components/contractor/dashboard/useNotifications";

export default function ContractorDashboard() {
  const {
    loading,
    setLoading,
    registering,
    setRegistering,
    contractor,
    setContractor,
    activeSection,
    setActiveSection,
    outbidCount,
    setOutbidCount,
    defectCount,
    setDefectCount,
  } = useDashboardState();

  const { handleRegistration, handleSignOut } = useContractorData({
    setLoading,
    setRegistering,
    setContractor,
    setOutbidCount,
    setDefectCount,
  });

  useNotifications(contractor, setOutbidCount, setDefectCount);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (registering) {
    return <RegistrationForm onSubmit={handleRegistration} loading={loading} />;
  }

  if (!contractor) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader contractor={contractor} onSignOut={handleSignOut} />
      <DashboardContent
        contractor={contractor}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        outbidCount={outbidCount}
        defectCount={defectCount}
      />
    </div>
  );
}