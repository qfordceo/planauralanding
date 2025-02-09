
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PricingPlanProps {
  name: string
  description: string
  price: number
  isSubscription?: boolean
  onSelect: () => void
}

export function PricingPlan({ 
  name, 
  description, 
  price, 
  isSubscription = false,
  onSelect 
}: PricingPlanProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="mb-4">
          <span className="text-3xl font-bold">${price}</span>
          {isSubscription && <span className="text-muted-foreground">/month</span>}
        </div>
        <div className="flex-1">
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button 
          className="w-full mt-6"
          onClick={onSelect}
          variant="default"
        >
          {isSubscription ? 'Get Started' : 'Purchase'}
        </Button>
      </CardContent>
    </Card>
  );
}
