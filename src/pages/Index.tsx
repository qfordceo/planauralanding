import { Suspense, lazy } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RoleGuard } from "@/components/auth/RoleGuard"
import { usePermissions } from "@/hooks/usePermissions"

// Lazy load main components
const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard").then(module => ({ default: module.default })))
const ContractorDashboard = lazy(() => import("@/components/contractor/ContractorDashboard").then(module => ({ default: module.ContractorDashboard })))
const ClientDashboard = lazy(() => import("@/components/client/ClientDashboard").then(module => ({ default: module.ClientDashboard })))
const ProjectView = lazy(() => import("@/components/projects/ProjectView").then(module => ({ default: module.ProjectView })))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

export default function Index() {
  const { toast } = useToast()
  const { isAdmin, isContractor } = usePermissions()

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const [profileResponse, contractorResponse, projectResponse] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('contractors').select('*').eq('user_id', user.id).single(),
          supabase.from('projects')
            .select(`
              *,
              contractor_bids!inner(
                id,
                contractor_id,
                bid_amount,
                status
              ),
              project_contracts(
                id,
                status,
                signed_by_client_at,
                signed_by_contractor_at
              )
            `)
            .eq('user_id', user.id)
            .eq('contractor_bids.status', 'accepted')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()
        ])

        return {
          profile: profileResponse.data,
          contractor: contractorResponse.error ? null : contractorResponse.data,
          activeProject: projectResponse.error ? null : projectResponse.data
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
        return null
      }
    }
  })

  if (isLoading) {
    return <LoadingFallback />
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {!userData ? (
          <ClientDashboard />
        ) : isAdmin ? (
          <RoleGuard requireAdmin>
            <AdminDashboard />
          </RoleGuard>
        ) : isContractor ? (
          <RoleGuard requireContractor>
            <ContractorDashboard contractor={userData.contractor} />
          </RoleGuard>
        ) : userData.activeProject ? (
          <ProjectView project={userData.activeProject} />
        ) : (
          <ClientDashboard />
        )}
      </Suspense>
    </ErrorBoundary>
  )
}