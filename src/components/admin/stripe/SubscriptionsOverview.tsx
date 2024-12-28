import { TrendingUp, DollarSign } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SubscriptionsData {
  active: number
  canceled: number
  revenue: number
}

interface SubscriptionsOverviewProps {
  subscriptions: SubscriptionsData
}

export function SubscriptionsOverview({ subscriptions }: SubscriptionsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscriptions.active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Canceled</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground rotate-180" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscriptions.canceled}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${subscriptions.revenue}</div>
        </CardContent>
      </Card>
    </div>
  )
}