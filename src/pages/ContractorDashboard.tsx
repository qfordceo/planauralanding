import { useEffect, useState } from "react";
import { DashboardContent } from "@/components/contractor/dashboard/DashboardContent";
import { useDashboardState } from "@/components/contractor/dashboard/DashboardState";
import { RegistrationForm } from "@/components/contractor/RegistrationForm";
import { useNotifications } from "@/components/contractor/dashboard/useNotifications";
import { TermsAcknowledgmentModal } from "@/components/contractor/TermsAcknowledgmentModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ContractorFormData } from "@/types/contractor";
import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/useAuthCheck";

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

  // Check authentication status
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

  const handleRegistrationSubmit = async (data: ContractorFormData) => {
    setRegistrationLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("contractors")
        .insert([
          {
            user_id: user.id,
            ...data
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your contractor profile has been created",
      });
      
      window.location.reload();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to create contractor profile",
        variant: "destructive",
      });
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleTermsAccept = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("contractors")
        .update({
          dpa_accepted: true,
          dpa_accepted_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setShowTermsModal(false);
      toast({
        title: "Success",
        description: "Terms acknowledgment recorded",
      });
    } catch (error) {
      console.error("Terms acceptance error:", error);
      toast({
        title: "Error",
        description: "Failed to update terms acceptance status",
        variant: "destructive",
      });
    }
  };

  useNotifications(contractor, setOutbidCount, setDefectCount);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (registering) {
    return (
      <RegistrationForm 
        onSubmit={handleRegistrationSubmit}
        loading={registrationLoading}
      />
    );
  }

  if (!contractor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Contractor Profile Found</h2>
          <p className="text-muted-foreground">Please contact support if this issue persists.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardContent
        contractor={contractor}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        outbidCount={outbidCount}
        defectCount={defectCount}
      />
      <TermsAcknowledgmentModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={handleTermsAccept}
      />
    </>
  );
}