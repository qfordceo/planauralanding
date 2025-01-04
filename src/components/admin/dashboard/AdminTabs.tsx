import { Suspense, lazy } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Loader2 } from "lucide-react"
import { AdminDocumentation } from "./AdminDocumentation"

// Lazy load all tab components
const WaitlistTable = lazy(() => import("@/components/admin/WaitlistTable").then(module => ({ default: module.WaitlistTable })))
const CommissionsTable = lazy(() => import("@/components/admin/CommissionsTable").then(module => ({ default: module.CommissionsTable })))
const ContractorAvailability = lazy(() => import("@/components/admin/ContractorAvailability").then(module => ({ default: module.ContractorAvailability })))
const ClientBuildsTable = lazy(() => import("@/components/admin/ClientBuildsTable").then(module => ({ default: module.ClientBuildsTable })))
const PurchasesTable = lazy(() => import("@/components/admin/PurchasesTable").then(module => ({ default: module.PurchasesTable })))
const PreApprovalTable = lazy(() => import("@/components/admin/PreApprovalTable").then(module => ({ default: module.PreApprovalTable })))
const ComplianceTable = lazy(() => import("@/components/admin/ComplianceTable").then(module => ({ default: module.ComplianceTable })))
const StripeDashboard = lazy(() => import("@/components/admin/StripeDashboard").then(module => ({ default: module.StripeDashboard })))
const WaiverTable = lazy(() => import("@/components/admin/WaiverTable").then(module => ({ default: module.WaiverTable })))
const DocumentRenewalTable = lazy(() => import("@/components/admin/DocumentRenewalTable").then(module => ({ default: module.DocumentRenewalTable })))

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

export function AdminTabs() {
  return (
    <Tabs defaultValue="waitlist" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 w-full">
        <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        <TabsTrigger value="commissions">Commissions</TabsTrigger>
        <TabsTrigger value="availability">Contractor Availability</TabsTrigger>
        <TabsTrigger value="builds">Saved Builds</TabsTrigger>
        <TabsTrigger value="purchases">Floor Plan Purchases</TabsTrigger>
        <TabsTrigger value="preapproval">Pre-approvals</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="stripe">Stripe Dashboard</TabsTrigger>
        <TabsTrigger value="docs">Documentation</TabsTrigger>
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

        <TabsContent value="docs" className="space-y-4">
          <Suspense fallback={<LoadingFallback />}>
            <AdminDocumentation />
          </Suspense>
        </TabsContent>
      </ErrorBoundary>
    </Tabs>
  )
}

export default AdminTabs
