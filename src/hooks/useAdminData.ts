import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminStats } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useAdminData() {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return null;
        }

        console.log('Fetching profile for user:', user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        console.log('Profile data:', profile);

        const [projectsResponse, approvalsResponse] = await Promise.all([
          supabase.from('projects').select('count').single(),
          supabase.from('contractor_compliance_documents')
            .select('count')
            .eq('verification_status', 'pending')
            .single(),
        ]);

        if (projectsResponse.error) throw projectsResponse.error;
        if (approvalsResponse.error) throw approvalsResponse.error;

        return {
          profile,
          stats: {
            totalProjects: projectsResponse.data?.count || 0,
            pendingApprovals: approvalsResponse.data?.count || 0,
          }
        };
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin dashboard data",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });
}