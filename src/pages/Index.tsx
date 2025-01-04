import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflowManager } from "@/components/contracts/ContractWorkflowManager";
import { ProjectLaunchFlow } from "@/components/projects/launch/ProjectLaunchFlow";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ContractorDashboard } from "@/components/contractor/ContractorDashboard";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: contractor, isLoading: contractorLoading } = useQuery({
    queryKey: ['contractor'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !profile?.is_admin,
  });

  const { data: activeProject } = useQuery({
    queryKey: ['active-project'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          contractor_bids!inner (
            id,
            contractor_id,
            bid_amount,
            status
          )
        `)
        .eq('user_id', user.id)
        .eq('contractor_bids.status', 'accepted')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching project:', error);
        return null;
      }

      return data;
    },
    enabled: !profile?.is_admin && !contractor,
  });

  useEffect(() => {
    if (activeProject?.id) {
      setProjectId(activeProject.id);
    }
  }, [activeProject]);

  if (profileLoading || contractorLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Admin view
  if (profile?.is_admin) {
    return <AdminDashboard />;
  }

  // Contractor view
  if (contractor) {
    return <ContractorDashboard contractor={contractor} />;
  }

  // Client view with active project
  if (projectId) {
    return activeProject?.contractor_bids ? (
      <ProjectLaunchFlow 
        projectId={projectId} 
        acceptedBid={activeProject.contractor_bids[0]} 
      />
    ) : (
      <ContractWorkflowManager projectId={projectId} />
    );
  }

  // Client view without active project
  return <ClientDashboard />;
}