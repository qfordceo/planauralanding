import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SavedFloorPlans } from "@/components/client/SavedFloorPlans";
import { SavedLandPlots } from "@/components/client/SavedLandPlots";
import { PreApprovalStatus } from "@/components/client/PreApprovalStatus";
import { BuildConsulting } from "@/components/client/BuildConsulting";
import { Profile, PreApprovalStatus as PreApprovalStatusType } from "@/types/profile";

export default function ClientDashboard() {
  const navigate = useNavigate();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;

      // Ensure the preapproval_status is of the correct type
      if (data) {
        const status = data.preapproval_status as PreApprovalStatusType;
        return {
          ...data,
          preapproval_status: status,
        } as Profile;
      }
      return null;
    }
  });

  if (isLoading) return <Progress value={30} className="w-full" />;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Client Dashboard</h1>
      
      <Tabs defaultValue="saved" className="space-y-8">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="saved">Saved Designs</TabsTrigger>
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
          {profile && <PreApprovalStatus profile={profile} />}
        </TabsContent>

        <TabsContent value="consulting">
          {profile && <BuildConsulting profile={profile} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}