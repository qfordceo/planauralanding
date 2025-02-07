
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export default function Pricing() {
  const navigate = useNavigate()

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
                <ul className="space-y-2 flex-1 mb-6">
                  <li>Up to 5 AI Pre-Inspections per month</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
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
                <ul className="space-y-2 flex-1 mb-6">
                  <li>1-5 active projects</li>
                  <li>Up to 50 AI Pre-Inspections per month</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
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
                <ul className="space-y-2 flex-1 mb-6">
                  <li>5-15 active projects</li>
                  <li>Up to 250 AI Pre-Inspections per month</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Per-Inspection Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-medium text-primary mb-8">
            Per-Inspection Pricing (For Non-Subscribers)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Single Inspection</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$9</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  <li>1 AI Pre-Inspection</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>10 Inspections</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$85</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  <li>10 AI Pre-Inspections</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>25 Inspections</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$200</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  <li>25 AI Pre-Inspections</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
                >
                  Purchase
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>50 Inspections</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <div className="mb-4">
                  <span className="text-3xl font-bold">$375</span>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  <li>50 AI Pre-Inspections</li>
                </ul>
                <Button 
                  className="w-full mt-auto"
                  onClick={() => navigate("/waitlist")}
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
