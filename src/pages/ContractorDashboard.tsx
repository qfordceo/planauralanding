import { useEffect, useState } from "react";
import { DashboardContent } from "@/components/contractor/dashboard/DashboardContent";
import { useDashboardState } from "@/components/contractor/dashboard/DashboardState";
import { RegistrationForm } from "@/components/contractor/RegistrationForm";
import { useNotifications } from "@/components/contractor/dashboard/useNotifications";
import { TermsAcknowledgmentModal } from "@/components/contractor/TermsAcknowledgmentModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ContractorDashboard() {
  const {
    loading,
    registering,
    contractor,
    setContractor,
    activeSection,
    setActiveSection,
    outbidCount,
    setOutbidCount,
    defectCount,
    setDefectCount,
  } = useDashboardState();

  const [showTermsModal, setShowTermsModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkContractorStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: contractor } = await supabase
        .from("contractors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (contractor && !contractor.dpa_accepted) {
        setShowTermsModal(true);
      }
    };

    checkContractorStatus();
  }, []);

  const handleTermsAccept = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("contractors")
      .update({
        dpa_accepted: true,
        dpa_accepted_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update terms acceptance status",
        variant: "destructive",
      });
      return;
    }

    setShowTermsModal(false);
    toast({
      title: "Success",
      description: "Terms acknowledgment recorded",
    });
  };

  useNotifications(contractor, setOutbidCount, setDefectCount);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (registering) {
    return <RegistrationForm />;
  }

  if (!contractor) {
    return <div>No contractor found</div>;
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