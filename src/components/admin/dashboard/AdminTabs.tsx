import { Suspense, lazy } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Loader2 } from "lucide-react"

// Lazy load all tab components
const WaitlistTable = lazy(() => import("@/components/admin/WaitlistTable"))
const CommissionsTable = lazy(() => import("@/components/admin/CommissionsTable"))
const ContractorAvailability = lazy(() => import("@/components/admin/ContractorAvailability"))
const ClientBuildsTable = lazy(() => import("@/components/admin/ClientBuildsTable"))
const PurchasesTable = lazy(() => import("@/components/admin/PurchasesTable"))
const PreApprovalTable = lazy(() => import("@/components/admin/PreApprovalTable"))
const ComplianceTable = lazy(() => import("@/components/admin/ComplianceTable"))
const StripeDashboard = lazy(() => import("@/components/admin/StripeDashboard"))
const WaiverTable = lazy(() => import("@/components/admin/WaiverTable"))
const DocumentRenewalTable = lazy(() => import("@/components/admin/DocumentRenewalTable"))

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

export function AdminTabs() {
  return (
    <Tabs defaultValue="waitlist" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full">
        <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        <TabsTrigger value="commissions">Commissions</TabsTrigger>
        <TabsTrigger value="availability">Contractor Availability</TabsTrigger>
        <TabsTrigger value="builds">Saved Builds</TabsTrigger>
        <TabsTrigger value="purchases">Floor Plan Purchases</TabsTrigger>
        <TabsTrigger value="preapproval">Pre-approvals</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="stripe">Stripe Dashboard</TabsTrigger>
      </TabsList>

      <ErrorBoundary>
        <TabsContent value="waitlist" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <WaitlistTable />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="commissions" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <CommissionsTable />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="availability" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <ContractorAvailability />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="builds" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <ClientBuildsTable />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <PurchasesTable />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="preapproval" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <PreApprovalTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4">
            <Suspense fallback={<LoadingFallback />}>
              <ComplianceTable />
              <WaiverTable />
              <DocumentRenewalTable />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <StripeDashboard />
          </Suspense>
        </TabsContent>
      </ErrorBoundary>
    </Tabs>
  )
}