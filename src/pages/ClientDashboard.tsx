import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SavedFloorPlans } from "@/components/client/SavedFloorPlans";
import { SavedLandPlots } from "@/components/client/SavedLandPlots";
import { PreApprovalStatus } from "@/components/client/PreApprovalStatus";
import { BuildConsulting } from "@/components/client/BuildConsulting";
import { BuildCostCard } from "@/components/client/BuildCostCard";
import { Profile } from "@/types/profile";

export default function ClientDashboard() {
  const navigate = useNavigate();
  
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
      
      console.log('Active build data:', data);
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
          />
        </div>
      ) : null}
      
      <Tabs defaultValue="saved" className="space-y-8">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="saved">Saved Floorplans</TabsTrigger>
          <TabsTrigger value="land">Land Plots</TabsTrigger>
          <TabsTrigger value="approval">Pre-Approval</TabsTrigger>
          <TabsTrigger value="consulting">Build Consulting</TabsTrigger>
        </TabsList>

        <TabsContent value="saved">
          <SavedFloorPlans />
        </TabsContent>

        <TabsContent value="land">
          <SavedLandPlots />
        </TabsContent>

        <TabsContent value="approval">
          <PreApprovalStatus profile={profile} />
        </TabsContent>

        <TabsContent value="consulting">
          <BuildConsulting profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}