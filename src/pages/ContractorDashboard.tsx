import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardContent } from "@/components/contractor/dashboard/DashboardContent";
import { useDashboardState } from "@/components/contractor/dashboard/DashboardState";
import { useNotifications } from "@/components/contractor/dashboard/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoadingState } from "@/components/contractor/dashboard/LoadingState";
import { NoProfileState } from "@/components/contractor/dashboard/NoProfileState";
import { ContractorRegistration } from "@/components/contractor/dashboard/ContractorRegistration";
import { TermsModal } from "@/components/contractor/dashboard/TermsModal";

const queryClient = new QueryClient();

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
    registrationLoading,
    setRegistrationLoading,
  } = useDashboardState();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useAuthCheck(navigate, "/auth");

  useEffect(() => {
    const checkContractorStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: contractor, error } = await supabase
          .from("contractors")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setRegistering(true);
          } else {
            console.error("Error fetching contractor:", error);
            toast({
              title: "Error",
              description: "Failed to load contractor profile",
              variant: "destructive",
            });
          }
        } else if (contractor) {
          setContractor(contractor);
          if (!contractor.dpa_accepted) {
            setShowTermsModal(true);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error in checkContractorStatus:", error);
        setLoading(false);
      }
    };

    checkContractorStatus();
  }, [navigate, setContractor, setLoading, setRegistering, toast]);

  useNotifications(contractor, setOutbidCount, setDefectCount);

  if (loading) {
    return <LoadingState />;
  }

  if (registering) {
    return (
      <ContractorRegistration
        setRegistering={setRegistering}
        registrationLoading={registrationLoading}
        setRegistrationLoading={setRegistrationLoading}
      />
    );
  }

  if (!contractor) {
    return <NoProfileState />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent
        contractor={contractor}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        outbidCount={outbidCount}
        defectCount={defectCount}
      />
      <TermsModal
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />
    </QueryClientProvider>
  );
}