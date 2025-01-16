import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAdminData } from "@/hooks/useAdminData";
import { Loader2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminDashboardControls } from "./dashboard/AdminDashboardControls";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminMetrics = lazy(() => import("./dashboard/AdminMetrics").then(module => ({ default: module.AdminMetrics })));
const ProjectOversight = lazy(() => import("./dashboard/ProjectOversight").then(module => ({ default: module.ProjectOversight })));
const AdminTabs = lazy(() => import("./dashboard/AdminTabs").then(module => ({ default: module.AdminTabs })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminData();
  const { isImpersonating, stopImpersonation } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('Admin dashboard error:', error);
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied
        </h1>
        <p className="text-gray-600">
          You don't have permission to access this page. Please make sure you are logged in with an admin account.
        </p>
      </div>
    );
  }

  if (!data?.profile?.is_admin) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied
        </h1>
        <p className="text-gray-600">
          This page is only accessible to administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ErrorBoundary>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <AdminDashboardControls 
            isImpersonating={isImpersonating}
            stopImpersonation={stopImpersonation}
          />
        </div>
        
        <Suspense fallback={<LoadingFallback />}>
          <AdminMetrics />
        </Suspense>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Project Oversight</h2>
          <Suspense fallback={<LoadingFallback />}>
            <ProjectOversight />
          </Suspense>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <AdminTabs />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default AdminDashboard;