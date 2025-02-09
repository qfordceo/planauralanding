
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { loadStripe } from "@stripe/stripe-js"
import { useQuery } from "@tanstack/react-query"
import { PricingSection } from "@/components/pricing/PricingSection"
import { EnterprisePlan } from "@/components/pricing/EnterprisePlan"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function Pricing() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: stripeProducts, isLoading, error } = useQuery({
    queryKey: ['stripeProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_products')
        .select('*')
        .order('price_amount')
      
      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }
      return data
    }
  })

  const handleSubscribe = async (priceId: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe to a plan.",
          variant: "destructive"
        })
        navigate("/auth")
        return
      }

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, mode: 'subscription' }
      })

      if (response.error) throw response.error

      const { data: { sessionId } } = response

      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      if (stripeError) throw stripeError

    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleOneTimePurchase = async (priceId: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to make a purchase.",
          variant: "destructive"
        })
        navigate("/auth")
        return
      }

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, mode: 'payment' }
      })

      if (response.error) throw response.error

      const { data: { sessionId } } = response

      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to initialize')

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      if (stripeError) throw stripeError

    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">Loading...</div>
  }

  if (error || !stripeProducts) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
        <div className="text-center text-red-600">
          Failed to load pricing information. Please try again later.
        </div>
      </div>
    )
  }

  // Filter valid products only
  const validProducts = stripeProducts.filter(product => 
    product && 
    product.price_id && 
    product.name && 
    product.description && 
    product.price_amount
  )

  const subscriptionPlans = validProducts.filter(p => p.price_type === 'subscription')
  const oneTimePlans = validProducts.filter(p => p.price_type === 'one_time')

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {subscriptionPlans.length > 0 && (
          <PricingSection
            title="Builder Plans"
            plans={subscriptionPlans}
            onSelect={handleSubscribe}
          />
        )}
        
        {oneTimePlans.length > 0 && (
          <PricingSection
            title="Pre-Inspection Packages"
            plans={oneTimePlans}
            onSelect={handleOneTimePurchase}
          />
        )}

        <EnterprisePlan />
      </div>
    </div>
  )
}
