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
import { DashboardHeader } from "./DashboardHeader";
import { useClientProfile } from "./hooks/useClientProfile";

const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const ContractorDashboard = lazy(() => import("@/components/contractor/ContractorDashboard").then(module => ({ default: module.ContractorDashboard })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export function DashboardContainer() {
  const { userData, isLoading } = useClientProfile();
  const { isAdmin, isContractor } = usePermissions();

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