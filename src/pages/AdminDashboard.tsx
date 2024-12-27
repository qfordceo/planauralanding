import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WaitlistTable } from "@/components/admin/WaitlistTable"
import { CommissionsTable } from "@/components/admin/CommissionsTable"
import { ContractorAvailability } from "@/components/admin/ContractorAvailability"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/auth')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      navigate('/')
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="container py-8">Loading...</div>
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
      </Tabs>
    </div>
  )
}