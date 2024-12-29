import { ContractorFormData } from "@/types/contractor";
import { RegistrationForm } from "../RegistrationForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContractorRegistrationProps {
  setRegistering: (value: boolean) => void;
  registrationLoading: boolean;
  setRegistrationLoading: (value: boolean) => void;
}

export function ContractorRegistration({ 
  setRegistering, 
  registrationLoading,
  setRegistrationLoading 
}: ContractorRegistrationProps) {
  const { toast } = useToast();

  const handleRegistrationSubmit = async (data: ContractorFormData) => {
    setRegistrationLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("contractors")
        .insert([{
          user_id: user.id,
          ...data
        }])
        .select()
        .single();

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

  return (
    <RegistrationForm 
      onSubmit={handleRegistrationSubmit}
      loading={registrationLoading}
    />
  );
}