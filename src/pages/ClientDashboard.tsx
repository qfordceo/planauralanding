import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Home, FileText, Wallet, HardHat } from "lucide-react";
import { DashboardCard } from "@/components/contractor/DashboardCard";
import { SavedFloorPlans } from "@/components/client/SavedFloorPlans";
import { SavedLandPlots } from "@/components/client/SavedLandPlots";
import { PreApprovalStatus } from "@/components/client/PreApprovalStatus";
import { BuildConsulting } from "@/components/client/BuildConsulting";
import { BuildCostCard } from "@/components/client/BuildCostCard";
import type { Profile } from "@/types/profile";

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        navigate('/auth');
        return null;
      }
      
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Profile error:', profileError);
        throw profileError;
      }

      return data as Profile;
    }
  });

  const { data: activeBuild, isLoading: buildLoading } = useQuery({
    queryKey: ['active-build', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from('build_cost_estimates')
        .select(`
          id,
          floor_plan_id,
          land_listing_id,
          target_build_cost,
          comp_average_price
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Active build error:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!profile?.id
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Progress value={30} className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Profile Found</AlertTitle>
          <AlertDescription>
            Unable to load your profile. Please try logging in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Client Dashboard</h1>
      
      {buildLoading ? (
        <div className="mb-8">
          <Progress value={30} className="w-full" />
        </div>
      ) : activeBuild ? (
        <div className="mb-8">
          <BuildCostCard 
            floorPlanId={activeBuild.floor_plan_id} 
            landListingId={activeBuild.land_listing_id}
            expanded={activeSection === 'costs'}
            onToggle={() => setActiveSection(activeSection === 'costs' ? null : 'costs')}
          />
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Saved Floor Plans"
          description="View and manage your saved floor plans"
          icon={Home}
          buttonText={activeSection === 'floor-plans' ? 'Close Floor Plans' : 'View Floor Plans'}
          onClick={() => setActiveSection(activeSection === 'floor-plans' ? null : 'floor-plans')}
          expanded={activeSection === 'floor-plans'}
        >
          {activeSection === 'floor-plans' && <SavedFloorPlans />}
        </DashboardCard>

        <DashboardCard
          title="Land Plots"
          description="Browse available land plots in your area"
          icon={FileText}
          buttonText={activeSection === 'land' ? 'Close Land Plots' : 'View Land Plots'}
          onClick={() => setActiveSection(activeSection === 'land' ? null : 'land')}
          expanded={activeSection === 'land'}
        >
          {activeSection === 'land' && <SavedLandPlots />}
        </DashboardCard>

        <DashboardCard
          title="Pre-Approval Status"
          description="Check your pre-approval status and amount"
          icon={Wallet}
          buttonText={activeSection === 'approval' ? 'Close Status' : 'View Status'}
          onClick={() => setActiveSection(activeSection === 'approval' ? null : 'approval')}
          expanded={activeSection === 'approval'}
        >
          {activeSection === 'approval' && <PreApprovalStatus profile={profile} />}
        </DashboardCard>

        <DashboardCard
          title="Build Consulting"
          description="Get expert guidance on your build project"
          icon={HardHat}
          buttonText={activeSection === 'consulting' ? 'Close Consulting' : 'View Consulting'}
          onClick={() => setActiveSection(activeSection === 'consulting' ? null : 'consulting')}
          expanded={activeSection === 'consulting'}
        >
          {activeSection === 'consulting' && (
            <BuildConsulting 
              profile={profile} 
              floorPlanId={activeBuild?.floor_plan_id}
            />
          )}
        </DashboardCard>
      </div>
    </div>
  );
}