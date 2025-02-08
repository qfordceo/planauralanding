import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const stripePriceIds = {
  contractor: 'price_1OzAzLAP9qoW6mSWL1Xrz9QU', // Contractor Plan $24.99/month
  smallBuilder: 'price_1OzB0HAP9qoW6mSWCdMjwn2z', // Small Builder Plan $199/month
  midBuilder: 'price_1OzB0vAP9qoW6mSWZQQBzGx3', // Mid-Sized Builder Plan $799/month
  singleInspection: 'price_1OzB1RAP9qoW6mSWaMNvliC4', // Single Pre-Inspection $9
  tenInspections: 'price_1OzB1tAP9qoW6mSWm9UYy1x9', // 10 Pre-Inspections $85
  twentyFiveInspections: 'price_1OzB2LAP9qoW6mSWcGBRFKBf', // 25 Pre-Inspections $200
}

export default function Pricing() {
  const navigate = useNavigate()
  const { toast } = useToast()

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

      const { data: { sessionId }, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, mode: 'subscription' }
      })

      if (checkoutError) throw checkoutError

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

      const { data: { sessionId }, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, mode: 'payment', quantity }
      })

      if (checkoutError) throw checkoutError

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

  return (
    <div className="min-h-screen bg-[#F5F5F7] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Subscription Model Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium text-primary mb-8">
            Subscription Model
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Contractor Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$24.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li>Up to 5 AI Pre-Inspections per month</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleSubscribe(stripePriceIds.contractor)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Small Builder Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li>1-5 active projects</li>
                  <li>Up to 50 AI Pre-Inspections per month</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleSubscribe(stripePriceIds.smallBuilder)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Mid-Sized Builder Plan</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$799</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li>5-15 active projects</li>
                  <li>Up to 250 AI Pre-Inspections per month</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleSubscribe(stripePriceIds.midBuilder)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Per-Pre-Inspection Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium text-primary mb-8">
            Individual Pre-Inspection Pricing (No Subscription)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Single Pre-Inspection</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$9</span>
                </div>
                <div className="flex-1"></div>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleOneTimePurchase(stripePriceIds.singleInspection)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>10 Pre-Inspections</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$85</span>
                </div>
                <div className="flex-1"></div>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleOneTimePurchase(stripePriceIds.tenInspections, 10)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>25 Pre-Inspections</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$200</span>
                </div>
                <div className="flex-1"></div>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => handleOneTimePurchase(stripePriceIds.twentyFiveInspections, 25)}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>
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
