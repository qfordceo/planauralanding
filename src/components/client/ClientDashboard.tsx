import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardGrid } from "./dashboard/DashboardGrid";
import type { Profile } from "@/types/profile";

export function ClientDashboard() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <DashboardHeader isLoading={isLoading} error={error} />
      {profile && (
        <DashboardGrid
          profile={profile}
          activeBuild={null}
          activeSection={null}
          setActiveSection={() => {}}
        />
      )}
    </div>
  );
}