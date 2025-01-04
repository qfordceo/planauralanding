import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminStats } from "@/types/admin";

export function useAdminData() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [profileResponse, projectsResponse, approvalsResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('projects').select('count').single(),
        supabase.from('contractor_compliance_documents')
          .select('count')
          .eq('verification_status', 'pending')
          .single(),
      ]);

      return {
        profile: profileResponse.data,
        stats: {
          totalProjects: projectsResponse.data?.count || 0,
          pendingApprovals: approvalsResponse.data?.count || 0,
        }
      };
    },
  });
}