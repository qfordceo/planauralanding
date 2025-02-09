
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { loadStripe } from "@stripe/stripe-js"
import { useQuery } from "@tanstack/react-query"
import { PricingSection } from "@/components/pricing/PricingSection"
import { EnterprisePlan } from "@/components/pricing/EnterprisePlan"

export default function Pricing() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Fetch Stripe products and publishable key
  const { data: stripeConfig } = useQuery({
    queryKey: ['stripeConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stripe_config')
        .select('value')
        .eq('key', 'publishable_key')
        .single()
      
      if (error) throw error
      console.log('Fetched Stripe config:', data)
      return data
    }
  })

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
      console.log('Available products and prices:', data)
      return data
    }
  })

  const handleCheckout = async (priceId: string) => {
    try {
      if (!stripeConfig?.value) {
        throw new Error('Stripe configuration not loaded')
      }

      console.log('Initiating checkout with price ID:', priceId)

      const { data: { session }, error: authError } = await supabase.auth.getSession()
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to continue.",
          variant: "destructive"
        })
        navigate("/auth")
        return
      }

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      })

      if (response.error) {
        console.error('Checkout error:', response.error)
        toast({
          title: "Checkout Error",
          description: response.error.message || "Failed to create checkout session",
          variant: "destructive"
        })
        return
      }

      const { data: { sessionId } } = response
      console.log('Created Stripe session:', sessionId)

      const stripe = await loadStripe(stripeConfig.value)
      if (!stripe) throw new Error('Failed to initialize Stripe')

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })
      if (stripeError) {
        console.error('Stripe redirect error:', stripeError)
        throw stripeError
      }

    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
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

  const subscriptionPlans = stripeProducts.filter(p => p.price_type === 'subscription')
  const oneTimePlans = stripeProducts.filter(p => p.price_type === 'one_time')

  console.log('Rendering subscription plans:', subscriptionPlans)
  console.log('Rendering one-time plans:', oneTimePlans)

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {subscriptionPlans.length > 0 && (
          <PricingSection
            title="Builder Plans"
            plans={subscriptionPlans}
            onSelect={handleCheckout}
          />
        )}
        
        {oneTimePlans.length > 0 && (
          <PricingSection
            title="Pre-Inspection Packages"
            plans={oneTimePlans}
            onSelect={handleCheckout}
          />
        )}

        <EnterprisePlan />
      </div>
    </div>
  )
}
