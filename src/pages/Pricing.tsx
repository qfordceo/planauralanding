
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { loadStripe } from "@stripe/stripe-js"
import { useQuery } from "@tanstack/react-query"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function Pricing() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Fetch stripe products from our database
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

  const handleOneTimePurchase = async (priceId: string, quantity: number = 1) => {
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
        body: { priceId, mode: 'payment', quantity }
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

  const subscriptionPlans = stripeProducts.filter(p => p.price_type === 'subscription')
  const oneTimePlans = stripeProducts.filter(p => p.price_type === 'one_time')

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Subscription Model Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium text-primary mb-8">
            Subscription Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${plan.price_amount}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    <li>{plan.description}</li>
                  </ul>
                  <Button 
                    className="w-full mt-auto"
                    onClick={() => handleSubscribe(plan.price_id)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Per-Pre-Inspection Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium text-primary mb-8">
            Individual Pre-Inspection Pricing (No Subscription)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {oneTimePlans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${plan.price_amount}</span>
                  </div>
                  <div className="flex-1">
                    <p>{plan.description}</p>
                  </div>
                  <Button 
                    className="w-full mt-auto"
                    onClick={() => handleOneTimePurchase(plan.price_id)}
                  >
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise Section */}
        <div>
          <h2 className="text-3xl font-heading font-medium text-primary mb-8">
            Enterprise Solutions
          </h2>
          <Card>
            <CardContent className="py-6">
              <p className="text-lg mb-4">
                For large-scale builders requiring high-volume inspection solutions, we offer custom enterprise plans.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate("/contact")}
              >
                Contact Us for Enterprise Pricing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
