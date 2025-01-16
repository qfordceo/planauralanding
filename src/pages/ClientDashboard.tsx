import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/client/dashboard/DashboardHeader";
import { DashboardGrid } from "@/components/client/dashboard/DashboardGrid";
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

  const { data: activeBuild } = useQuery({
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
          comp_average_price,
          land_cost
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

  const dashboardTitle = profile?.email 
    ? `${profile.email.split('@')[0]}'s Dashboard`
    : 'My Dashboard';

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-4">{dashboardTitle}</h1>
      <DashboardHeader isLoading={isLoading} error={error} />
      {profile && (
        <DashboardGrid
          profile={profile}
          activeBuild={activeBuild}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
    </div>
  );
}