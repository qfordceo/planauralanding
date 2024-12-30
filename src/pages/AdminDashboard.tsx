import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AdminDashboardContainer } from "@/components/admin/dashboard/AdminDashboardContainer"

const queryClient = new QueryClient()

export default function AdminDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboardContainer />
    </QueryClientProvider>
  )
}