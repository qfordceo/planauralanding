import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Contractor } from "@/types/contractor";

export function useContractorDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
          console.error("Error fetching contractor:", error);
          toast({
            title: "Error",
            description: "Failed to load contractor profile",
            variant: "destructive",
          });
          setError(error.message);
        } else if (contractor) {
          setContractor(contractor);
          if (!contractor.dpa_accepted) {
            setShowTermsModal(true);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error in checkContractorStatus:", error);
        setIsLoading(false);
        setError("An unexpected error occurred");
      }
    };

    checkContractorStatus();
  }, [navigate, toast]);

  return {
    isLoading,
    error,
    contractor,
    showTermsModal,
    setShowTermsModal,
  };
}