
import { PricingPlan } from "./PricingPlan"

interface PricingProduct {
  id: string
  name: string
  description: string
  price_amount: number
  price_id: string
  price_type: string
}

interface PricingSectionProps {
  title: string
  plans: PricingProduct[]
  onSelect: (priceId: string) => void
}

export function PricingSection({ title, plans, onSelect }: PricingSectionProps) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-heading font-medium text-primary mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.id}
            name={plan.name}
            description={plan.description}
            price={plan.price_amount}
            isSubscription={plan.price_type === 'subscription'}
            onSelect={() => onSelect(plan.price_id)}
          />
        ))}
      </div>
    </div>
  )
}
