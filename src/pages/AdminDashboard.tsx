import { useState } from "react"
import { AdminHeader } from "@/components/admin/dashboard/AdminHeader"
import { AdminTabs } from "@/components/admin/dashboard/AdminTabs"
import { useAdminAuth } from "@/components/admin/dashboard/AdminAuth"
import { LoadingState } from "@/components/admin/dashboard/LoadingState"
import { FinancialOverview } from "@/components/admin/FinancialOverview"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useAdminAuth({ setLoading, setError })

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="container py-8 space-y-8">
      <AdminHeader error={error} />
      {!error && (
        <>
          <FinancialOverview />
          <AdminTabs />
        </>
      )}
    </div>
  )
}