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

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          navigate('/auth')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle()

        if (error) throw error

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

      <Tabs defaultValue="waitlist" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="availability">Contractor Availability</TabsTrigger>
          <TabsTrigger value="builds">Saved Builds</TabsTrigger>
          <TabsTrigger value="purchases">Floor Plan Purchases</TabsTrigger>
          <TabsTrigger value="preapproval">Pre-approvals</TabsTrigger>
        </TabsList>
        <TabsContent value="waitlist">
          <WaitlistTable />
        </TabsContent>
        <TabsContent value="commissions">
          <CommissionsTable />
        </TabsContent>
        <TabsContent value="availability">
          <ContractorAvailability />
        </TabsContent>
        <TabsContent value="builds">
          <ClientBuildsTable />
        </TabsContent>
        <TabsContent value="purchases">
          <PurchasesTable />
        </TabsContent>
        <TabsContent value="preapproval">
          <PreApprovalTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}