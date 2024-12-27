import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, Calendar, Star, Bell, Bug, ArrowUpDown } from "lucide-react";
import type { Contractor, ContractorFormData } from "@/types/contractor";
import { RegistrationForm } from "@/components/contractor/RegistrationForm";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { PortfolioManager } from "@/components/contractor/PortfolioManager";
import { ContractorReviews } from "@/components/contractor/ContractorReviews";
import { BidNotifications } from "@/components/contractor/BidNotifications";
import { DefectTracker } from "@/components/contractor/DefectTracker";
import { RebidManager } from "@/components/contractor/RebidManager";
import { DashboardHeader } from "@/components/contractor/DashboardHeader";

export default function ContractorDashboard() {
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [outbidCount, setOutbidCount] = useState(0);
  const [defectCount, setDefectCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (contractor) {
      subscribeToOutbids();
      fetchOutbidCount();
      fetchDefectCount();
    }
  }, [contractor]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth?type=contractor');
        return;
      }

      // Use a direct query to ensure we get fresh data
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
        console.log('Fetched contractor data:', contractorData); // Debug log
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

  const subscribeToOutbids = () => {
    const channel = supabase
      .channel('contractor-outbids')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_bids',
          filter: `contractor_id=eq.${contractor?.id}`,
        },
        () => {
          fetchOutbidCount();
          toast({
            title: "Bid Status Updated",
            description: "One of your bids has been affected by a new bid.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchOutbidCount = async () => {
    if (!contractor) return;
    
    const { count, error } = await supabase
      .from('contractor_bids')
      .select('*', { count: 'exact', head: true })
      .eq('contractor_id', contractor.id)
      .eq('outbid', true);

    if (!error && count !== null) {
      setOutbidCount(count);
    }
  };

  const fetchDefectCount = async () => {
    if (!contractor) return;
    
    const { count, error } = await supabase
      .from('contractor_inspection_defects')
      .select('*', { count: 'exact', head: true })
      .eq('contractor_id', contractor.id)
      .eq('resolved', false);

    if (!error && count !== null) {
      setDefectCount(count);
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
      <DashboardHeader contractor={contractor} onSignOut={handleSignOut} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Portfolio"
          description="Showcase your best work and completed projects."
          icon={Briefcase}
          buttonText={activeSection === 'portfolio' ? 'Close Portfolio' : 'Manage Portfolio'}
          onClick={() => setActiveSection(activeSection === 'portfolio' ? null : 'portfolio')}
          expanded={activeSection === 'portfolio'}
        >
          {activeSection === 'portfolio' && <PortfolioManager contractorId={contractor.id} />}
        </DashboardCard>

        <DashboardCard
          title="Reviews & Ratings"
          description="View your client reviews and overall rating."
          icon={Star}
          buttonText={activeSection === 'reviews' ? 'Close Reviews' : 'View Reviews'}
          onClick={() => setActiveSection(activeSection === 'reviews' ? null : 'reviews')}
          expanded={activeSection === 'reviews'}
        >
          {activeSection === 'reviews' && <ContractorReviews contractorId={contractor.id} />}
        </DashboardCard>

        <DashboardCard
          title="Bid Notifications"
          description="Check your bid status and notifications."
          icon={Bell}
          buttonText={activeSection === 'notifications' ? 'Close Notifications' : 'View Notifications'}
          onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
          expanded={activeSection === 'notifications'}
          badge={outbidCount > 0 ? { count: outbidCount, variant: "destructive" } : undefined}
        >
          {activeSection === 'notifications' && <BidNotifications contractorId={contractor.id} />}
        </DashboardCard>

        <DashboardCard
          title="Inspection Defects"
          description="Track and manage inspection defects."
          icon={Bug}
          buttonText={activeSection === 'defects' ? 'Close Defects' : 'View Defects'}
          onClick={() => setActiveSection(activeSection === 'defects' ? null : 'defects')}
          expanded={activeSection === 'defects'}
          badge={defectCount > 0 ? { count: defectCount, variant: "warning" } : undefined}
        >
          {activeSection === 'defects' && <DefectTracker contractorId={contractor.id} />}
        </DashboardCard>

        <DashboardCard
          title="Re-bid Projects"
          description="Review and update bids for projects where you've been outbid."
          icon={ArrowUpDown}
          buttonText={activeSection === 'rebid' ? 'Close Re-bid' : 'Manage Re-bids'}
          onClick={() => setActiveSection(activeSection === 'rebid' ? null : 'rebid')}
          expanded={activeSection === 'rebid'}
        >
          {activeSection === 'rebid' && <RebidManager contractorId={contractor.id} />}
        </DashboardCard>

        <DashboardCard
          title="Availability"
          description="Set your working hours and manage appointments."
          icon={Calendar}
          buttonText="Set Availability"
          onClick={() => {}} // TODO: Implement availability management
        />
      </div>
    </div>
  );
}