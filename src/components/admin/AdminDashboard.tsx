import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { data: profile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!profile?.is_admin) {
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
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <FinancialOverview />
          <WaitlistTable />
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <ContractorAvailability />
          <ComplianceTable />
          <DocumentRenewalTable />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ClientBuildsTable />
          <PreApprovalTable />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <WaiverTable />
          <ComplianceTable />
          <DocumentRenewalTable />
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <StripeDashboard />
          <CommissionsTable />
          <PurchasesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}