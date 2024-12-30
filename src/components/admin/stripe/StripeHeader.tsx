import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StripeHeader() {
  return (
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="expenses">Expenses</TabsTrigger>
      <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
    </TabsList>
  )
}