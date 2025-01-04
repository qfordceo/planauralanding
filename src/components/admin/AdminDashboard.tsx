import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAdminData } from "@/hooks/useAdminData";
import { OverviewSection } from "./dashboard/sections/OverviewSection";
import { FinancialOverview } from "./FinancialOverview";
import { CommissionsTable } from "./CommissionsTable";
import { ContractorAvailability } from "./ContractorAvailability";
import { ClientBuildsTable } from "./ClientBuildsTable";
import { ComplianceTable } from "./ComplianceTable";
import { WaiverTable } from "./WaiverTable";
import { DocumentRenewalTable } from "./DocumentRenewalTable";
import { PreApprovalTable } from "./PreApprovalTable";
import { PurchasesTable } from "./PurchasesTable";
import { WaitlistTable } from "./WaitlistTable";
import { StripeDashboard } from "./StripeDashboard";

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <p>Loading dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.profile?.is_admin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You do not have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        <OverviewSection 
          totalProjects={data.stats.totalProjects}
          pendingApprovals={data.stats.pendingApprovals}
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contractors">Contractors</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ErrorBoundary>
              <div className="grid gap-4 md:grid-cols-2">
                <WaitlistTable />
                <DocumentRenewalTable />
              </div>
              <div className="mt-4">
                <FinancialOverview />
              </div>
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="contractors">
            <ErrorBoundary>
              <ContractorAvailability />
              <ComplianceTable />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="clients">
            <ErrorBoundary>
              <ClientBuildsTable />
              <PreApprovalTable />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="compliance">
            <ErrorBoundary>
              <WaiverTable />
              <ComplianceTable />
              <DocumentRenewalTable />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="finances">
            <ErrorBoundary>
              <StripeDashboard />
              <CommissionsTable />
              <PurchasesTable />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}