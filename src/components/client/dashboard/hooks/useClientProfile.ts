import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useClientProfile() {
  const { toast } = useToast();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const [profileResponse, projectResponse] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('projects')
            .select(`
              *,
              project_tasks(id, title, status),
              project_contracts(id, status)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        ]);

        return {
          profile: profileResponse.data,
          activeProject: projectResponse.error ? null : projectResponse.data
        };
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
        return null;
      }
    }
  });

  return { userData, isLoading };
}