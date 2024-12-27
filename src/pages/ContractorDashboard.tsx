import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, Calendar, Star, LogOut } from "lucide-react";
import type { Contractor, ContractorFormData } from "@/types/contractor";
import { RegistrationForm } from "@/components/contractor/RegistrationForm";
import { DashboardCard } from "@/components/contractor/DashboardCard";

export default function ContractorDashboard() {
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

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

      if (error) throw error;
      
      if (contractorData) {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth?type=contractor');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Welcome, {contractor.business_name}!</h1>
        <Button variant="ghost" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Portfolio"
          description="Showcase your best work and completed projects."
          icon={Briefcase}
          buttonText="Manage Portfolio"
          onClick={() => {}} // TODO: Implement portfolio management
        />
        <DashboardCard
          title="Availability"
          description="Set your working hours and manage appointments."
          icon={Calendar}
          buttonText="Set Availability"
          onClick={() => {}} // TODO: Implement availability management
        />
        <DashboardCard
          title="References"
          description="Add client references and testimonials."
          icon={Star}
          buttonText="Add References"
          onClick={() => {}} // TODO: Implement references management
        />
      </div>
    </div>
  );
}
