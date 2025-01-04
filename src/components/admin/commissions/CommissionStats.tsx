import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

interface CommissionStatsProps {
  totalCommissions: number
  unpaidCommissions: number
}

export function CommissionStats({ totalCommissions, unpaidCommissions }: CommissionStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${totalCommissions?.toFixed(2) || "0.00"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Unpaid Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${unpaidCommissions?.toFixed(2) || "0.00"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}