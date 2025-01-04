import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ContractWorkflowManager } from "@/components/contracts/ContractWorkflowManager";
import { ProjectLaunchFlow } from "@/components/projects/launch/ProjectLaunchFlow";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { ContractorDashboard } from "@/components/contractor/ContractorDashboard";
import { ClientDashboard } from "@/components/client/ClientDashboard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get user profile and role
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

  // Get contractor profile if exists
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

  // Get active project with accepted bid
  const { data: activeProject } = useQuery({
    queryKey: ['active-project'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
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
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching project:', error);
        return null;
      }

      return data;
    },
    enabled: !profile?.is_admin && !contractor,
  });

  // Set active project ID and handle portal activation
  useEffect(() => {
    if (activeProject?.id) {
      setProjectId(activeProject.id);

      // Check if contract is signed by both parties
      const contract = activeProject.project_contracts?.[0];
      if (contract?.signed_by_client_at && contract?.signed_by_contractor_at && contract.status !== 'active') {
        // Activate the project portal
        supabase
          .from('project_contracts')
          .update({ status: 'active' })
          .eq('id', contract.id)
          .then(({ error }) => {
            if (error) {
              console.error('Error activating project portal:', error);
              toast({
                title: "Error",
                description: "Failed to activate project portal",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Success",
                description: "Project portal has been activated",
              });
            }
          });
      }
    }
  }, [activeProject, toast]);

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
    // Show contract workflow if contract exists but isn't fully signed
    const contract = activeProject?.project_contracts?.[0];
    if (contract && (!contract.signed_by_client_at || !contract.signed_by_contractor_at)) {
      return <ContractWorkflowManager projectId={projectId} />;
    }

    // Show project launch flow if bid is accepted but no contract exists
    if (activeProject?.contractor_bids && !contract) {
      return (
        <ProjectLaunchFlow 
          projectId={projectId} 
          acceptedBid={activeProject.contractor_bids[0]} 
        />
      );
    }

    // Show client dashboard for active projects
    return <ClientDashboard />;
  }

  // Default client view without active project
  return <ClientDashboard />;
}