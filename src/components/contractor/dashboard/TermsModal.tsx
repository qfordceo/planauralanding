import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TermsAcknowledgmentModal } from "../TermsAcknowledgmentModal";

interface TermsModalProps {
  showTermsModal: boolean;
  setShowTermsModal: (value: boolean) => void;
}

export function TermsModal({ showTermsModal, setShowTermsModal }: TermsModalProps) {
  const { toast } = useToast();

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

  return (
    <TermsAcknowledgmentModal
      open={showTermsModal}
      onOpenChange={setShowTermsModal}
      onAccept={handleTermsAccept}
    />
  );
}