import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ContractorFormData } from "@/types/contractor";

export function useContractorData({
  setLoading,
  setRegistering,
  setContractor,
  setOutbidCount,
  setDefectCount,
}) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth?type=contractor');
        return;
      }

      const { data: contractorData, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching contractor:', error);
        throw error;
      }
      
      if (contractorData) {
        console.log('Fetched contractor data:', contractorData);
        setContractor(contractorData);
      } else {
        setRegistering(true);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      toast({
        title: "Error",
        description: "Failed to load contractor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (formData: ContractorFormData) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('contractors')
        .insert({
          user_id: user.id,
          ...formData
        })
        .select()
        .single();

      if (error) throw error;

      setContractor(data);
      setRegistering(false);
      toast({
        title: "Success",
        description: "Contractor profile created successfully",
      });
    } catch (error) {
      console.error('Error registering contractor:', error);
      toast({
        title: "Error",
        description: "Failed to create contractor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth?type=contractor');
  };

  useEffect(() => {
    checkUser();
  }, []);

  return { handleRegistration, handleSignOut };
}