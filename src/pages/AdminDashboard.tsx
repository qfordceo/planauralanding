import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaitlistTable } from "@/components/admin/WaitlistTable"
import { CommissionsTable } from "@/components/admin/CommissionsTable"
import { ContractorAvailability } from "@/components/admin/ContractorAvailability"
import { ClientBuildsTable } from "@/components/admin/ClientBuildsTable"
import { PurchasesTable } from "@/components/admin/PurchasesTable"
import { PreApprovalTable } from "@/components/admin/PreApprovalTable"
import { StripeDashboard } from "@/components/admin/StripeDashboard"
import { FinancialOverview } from "@/components/admin/FinancialOverview"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        
        if (!session) {
          navigate('/auth')
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle()

        if (profileError) throw profileError

        if (!profile?.is_admin) {
          navigate('/')
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive",
          })
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking admin access:', error)
        navigate('/')
        toast({
          title: "Error",
          description: "Failed to verify admin access",
          variant: "destructive",
        })
      }
    }

    checkAdminAccess()
  }, [navigate, toast])

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      </div>

      <FinancialOverview />

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
    </div>
  )
}