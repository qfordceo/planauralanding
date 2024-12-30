import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { WaitlistTable } from "@/components/admin/WaitlistTable"
import { CommissionsTable } from "@/components/admin/CommissionsTable"
import { ContractorAvailability } from "@/components/admin/ContractorAvailability"
import { ClientBuildsTable } from "@/components/admin/ClientBuildsTable"
import { PurchasesTable } from "@/components/admin/PurchasesTable"
import { PreApprovalTable } from "@/components/admin/PreApprovalTable"
import { StripeDashboard } from "@/components/admin/StripeDashboard"

export function AdminTabs() {
  return (
    <Tabs defaultValue="waitlist" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
        <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        <TabsTrigger value="commissions">Commissions</TabsTrigger>
        <TabsTrigger value="availability">Contractor Availability</TabsTrigger>
        <TabsTrigger value="builds">Saved Builds</TabsTrigger>
        <TabsTrigger value="purchases">Floor Plan Purchases</TabsTrigger>
        <TabsTrigger value="preapproval">Pre-approvals</TabsTrigger>
        <TabsTrigger value="stripe">Stripe Dashboard</TabsTrigger>
      </TabsList>

      <TabsContent value="waitlist" className="space-y-4">
        <WaitlistTable />
      </TabsContent>
      
      <TabsContent value="commissions" className="space-y-4">
        <CommissionsTable />
      </TabsContent>
      
      <TabsContent value="availability" className="space-y-4">
        <ContractorAvailability />
      </TabsContent>
      
      <TabsContent value="builds" className="space-y-4">
        <ClientBuildsTable />
      </TabsContent>
      
      <TabsContent value="purchases" className="space-y-4">
        <PurchasesTable />
      </TabsContent>
      
      <TabsContent value="preapproval" className="space-y-4">
        <PreApprovalTable />
      </TabsContent>

      <TabsContent value="stripe" className="space-y-4">
        <StripeDashboard />
      </TabsContent>
    </Tabs>
  );
}