import { Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { usePermissions } from "@/hooks/usePermissions";
import { ProjectManagementSection } from "@/components/projects/ProjectManagementSection";
import { ProjectDashboard } from "@/components/client/dashboard/ProjectDashboard";

const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const ContractorDashboard = lazy(() => import("@/components/contractor/ContractorDashboard").then(module => ({ default: module.ContractorDashboard })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export default function Index() {
  const { toast } = useToast();
  const { isAdmin, isContractor } = usePermissions();

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

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isAdmin) {
    return (
      <RoleGuard requireAdmin>
        <Suspense fallback={<LoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      </RoleGuard>
    );
  }

  if (isContractor) {
    return (
      <RoleGuard requireContractor>
        <Suspense fallback={<LoadingFallback />}>
          <ContractorDashboard contractor={userData?.profile} />
        </Suspense>
      </RoleGuard>
    );
  }

  if (userData?.activeProject) {
    return (
      <div className="container mx-auto p-6">
        <ProjectDashboard projectId={userData.activeProject.id} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <ProjectManagementSection />
    </div>
  );
}