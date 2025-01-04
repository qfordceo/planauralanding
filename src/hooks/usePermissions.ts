import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePermissions() {
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    }
  });

  const { data: contractorProfile } = useQuery({
    queryKey: ['contractor-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: contractor } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return contractor;
    },
    enabled: !!userProfile
  });

  const canManageProject = async (projectId: string) => {
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();

    return project?.user_id === userProfile?.id;
  };

  const canAccessContract = async (contractId: string) => {
    const { data: contract } = await supabase
      .from('project_contracts')
      .select('project_id')
      .eq('id', contractId)
      .single();

    if (!contract) return false;

    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', contract.project_id)
      .single();

    return project?.user_id === userProfile?.id;
  };

  const canManageDispute = async (disputeId: string) => {
    const { data: dispute } = await supabase
      .from('project_disputes')
      .select('raised_by_id, against_id, mediator_id')
      .eq('id', disputeId)
      .single();

    if (!dispute) return false;
    
    return dispute.raised_by_id === userProfile?.id || 
           dispute.against_id === userProfile?.id || 
           dispute.mediator_id === userProfile?.id;
  };

  const isAdmin = userProfile?.is_admin ?? false;
  const isContractor = !!contractorProfile;

  return {
    isAdmin,
    isContractor,
    canManageProject,
    canAccessContract,
    canManageDispute,
    userProfile,
    contractorProfile,
  };
}