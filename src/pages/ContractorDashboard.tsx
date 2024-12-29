import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/contractor/DashboardHeader";
import { DashboardContent } from "@/components/contractor/dashboard/DashboardContent";
import { useDashboardState } from "@/components/contractor/dashboard/DashboardState";
import { useContractorData } from "@/components/contractor/dashboard/useContractorData";
import { useNotifications } from "@/components/contractor/dashboard/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          navigate('/auth?type=contractor');
          return;
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        navigate('/auth?type=contractor');
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth?type=contractor');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

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