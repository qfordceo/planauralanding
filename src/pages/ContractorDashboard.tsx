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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "./AdminDashboard";
import { ClientDashboard } from "@/components/client/ClientDashboard";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useAuthCheck(navigate, "/auth");

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        setIsAdmin(profile?.is_admin || false);

        // Check contractor status
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
        console.error("Error in checkUserStatus:", error);
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [navigate, setContractor, setLoading, setRegistering, toast]);

  useNotifications(contractor, setOutbidCount, setDefectCount);

  if (loading) {
    return <LoadingState />;
  }

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Control Panel</h1>
          <Tabs defaultValue="contractor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contractor">Contractor View</TabsTrigger>
              <TabsTrigger value="client">Client View</TabsTrigger>
              <TabsTrigger value="admin">Admin View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contractor">
              {registering ? (
                <ContractorRegistration
                  setRegistering={setRegistering}
                  registrationLoading={registrationLoading}
                  setRegistrationLoading={setRegistrationLoading}
                />
              ) : !contractor ? (
                <NoProfileState />
              ) : (
                <DashboardContent
                  contractor={contractor}
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                  outbidCount={outbidCount}
                  defectCount={defectCount}
                />
              )}
            </TabsContent>

            <TabsContent value="client">
              <ClientDashboard />
            </TabsContent>

            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </QueryClientProvider>
    );
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
      <div className="container mx-auto p-6">
        <DashboardContent
          contractor={contractor}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          outbidCount={outbidCount}
          defectCount={defectCount}
        />
      </div>
      <TermsModal
        showTermsModal={showTermsModal}
        setShowTermsModal={setShowTermsModal}
      />
    </QueryClientProvider>
  );
}