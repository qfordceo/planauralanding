import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAdminData } from "@/hooks/useAdminData";
import { AdminMetrics } from "./dashboard/AdminMetrics";
import { ProjectOversight } from "./dashboard/ProjectOversight";
import { AdminTabs } from "./dashboard/AdminTabs";
import { Loader2 } from "lucide-react";

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminData();

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <ErrorBoundary>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <AdminMetrics />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Project Oversight</h2>
          <ProjectOversight />
        </div>
        <AdminTabs />
      </ErrorBoundary>
    </div>
  );
}