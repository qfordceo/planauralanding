import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAdminData } from "@/hooks/useAdminData";
import { Loader2 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data?.profile?.is_admin) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">
          Access Denied
        </h1>
        <p className="text-gray-600">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  const handleViewAs = (type: 'client' | 'contractor') => {
    navigate(type === 'client' ? '/client-dashboard' : '/contractor-dashboard');
    toast({
      title: `Viewing as ${type}`,
      description: `Now viewing the ${type} dashboard as an admin`,
    });
  };

  const handleImpersonateView = (type: 'client' | 'contractor') => {
    navigate(type === 'client' ? '/client-dashboard' : '/contractor-dashboard');
    toast({
      title: `Impersonating ${type}`,
      description: `Now viewing the ${type} dashboard as if you were a ${type}`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ErrorBoundary>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {isImpersonating ? (
            <Button 
              variant="destructive"
              onClick={() => stopImpersonation()}
            >
              Stop Impersonation
            </Button>
          ) : (
            <div className="flex gap-4">
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold mb-2">Direct View</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleViewAs('client')}
                  >
                    Client Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleViewAs('contractor')}
                  >
                    Contractor Dashboard
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold mb-2">Impersonation Mode</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="secondary"
                    onClick={() => handleImpersonateView('client')}
                  >
                    Impersonate Client
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleImpersonateView('contractor')}
                  >
                    Impersonate Contractor
                  </Button>
                </div>
              </div>
            </div>
          )}
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