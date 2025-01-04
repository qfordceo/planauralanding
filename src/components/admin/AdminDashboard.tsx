import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Users, 
  HardHat, 
  Shield, 
  DollarSign,
  ClipboardList,
  FileCheck,
  AlertTriangle,
  Receipt,
  UserPlus 
} from "lucide-react";
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
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="contractors" className="flex items-center gap-2">
            <HardHat className="h-4 w-4" />
            Contractors
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="finances" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Finances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  New Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WaitlistTable />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Urgent Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentRenewalTable />
              </CardContent>
            </Card>
          </div>
          <FinancialOverview />
        </TabsContent>

        <TabsContent value="contractors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Contractor Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ContractorAvailability />
              <ComplianceTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ClientBuildsTable />
              <PreApprovalTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <WaiverTable />
              <ComplianceTable />
              <DocumentRenewalTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Financial Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StripeDashboard />
              <CommissionsTable />
              <PurchasesTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}