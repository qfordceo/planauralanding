import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CommissionStats } from "./commissions/CommissionStats"
import { CommissionsTableView } from "./commissions/CommissionsTableView"
import { useCommissionsData } from "./commissions/useCommissionsData"

export function CommissionsTable() {
  const { purchases, isLoading, totalCommissions, unpaidCommissions } = useCommissionsData()

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Commissions Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommissionStats
          totalCommissions={totalCommissions || 0}
          unpaidCommissions={unpaidCommissions || 0}
        />
        <CommissionsTableView purchases={purchases || []} />
      </CardContent>
    </Card>
  )
}