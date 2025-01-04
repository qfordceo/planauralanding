import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ContractorDashboard } from "@/components/contractor/ContractorDashboard";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { ProjectView } from "@/components/projects/ProjectView";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  profile: any;
  contractor: any;
  activeProject: any;
}

export default function Index() {
  const { toast } = useToast();

  const { data: userData, isLoading } = useQuery<UserData>({
    queryKey: ['user-data'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [profileResponse, contractorResponse, projectResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('contractors').select('*').eq('user_id', user.id).single(),
        supabase.from('projects')
          .select(`
            *,
            contractor_bids!inner(
              id,
              contractor_id,
              bid_amount,
              status
            ),
            project_contracts(
              id,
              status,
              signed_by_client_at,
              signed_by_contractor_at
            )
          `)
          .eq('user_id', user.id)
          .eq('contractor_bids.status', 'accepted')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
      ]);

      return {
        profile: profileResponse.data,
        contractor: contractorResponse.error ? null : contractorResponse.data,
        activeProject: projectResponse.error ? null : projectResponse.data
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return <ClientDashboard />;
  }

  const { profile, contractor, activeProject } = userData;

  // Admin view
  if (profile?.is_admin) {
    return <AdminDashboard />;
  }

  // Contractor view
  if (contractor) {
    return <ContractorDashboard contractor={contractor} />;
  }

  // Client with active project
  if (activeProject) {
    return <ProjectView project={activeProject} />;
  }

  // Default client view
  return <ClientDashboard />;
}