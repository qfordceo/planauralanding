
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Construction, Phone, MapPin, Check } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function LandingPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const pricingTiers = [
    {
      name: "Basic",
      price: "199",
      description: "Perfect for single-family homes",
      features: [
        "AI-powered inspection analysis",
        "Basic compliance report",
        "24-hour turnaround",
        "PDF report generation",
      ]
    },
    {
      name: "Professional",
      price: "399",
      description: "Ideal for property managers",
      features: [
        "Everything in Basic",
        "Advanced compliance checks",
        "Priority processing",
        "Multi-property dashboard",
        "Detailed material analysis",
        "Code violation detection"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For construction companies & large portfolios",
      features: [
        "Everything in Professional",
        "Custom API integration",
        "Bulk property analysis",
        "White-label reports",
        "Dedicated support",
        "Custom compliance rules"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {/* Under Construction Banner */}
      <div className="w-full bg-accent/10 py-2 text-center text-accent flex items-center justify-center gap-2">
        <Construction className="h-4 w-4" />
        <span className="text-sm">Site Under Construction</span>
      </div>

      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex flex-wrap justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <img 
          src="/lovable-uploads/3ced312b-91d4-4b7d-abe6-d7ac97f865c0.png" 
          alt="Plan Aura Logo" 
          className="h-12"
        />
        <div className={`flex gap-2 ${isMobile ? 'w-full mt-4 justify-center' : ''}`}>
          <Button 
            variant="ghost"
            onClick={() => navigate("/auth?type=client")}
            className="text-primary hover:text-primary/80"
          >
            Client Sign In
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/auth?type=contractor")}
            className="text-primary hover:text-primary/80"
          >
            Contractor Sign In
          </Button>
          <Button 
            variant="default"
            onClick={() => navigate("/waitlist")}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Join Waitlist
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 px-6 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-medium text-primary mb-4 tracking-tight">
          AI-Powered Home Inspection
        </h1>
        <p className="text-xl md:text-2xl font-heading text-accent mb-6">
          Revolutionizing Property Inspection with Artificial Intelligence
        </p>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 px-4">
          Our advanced AI technology analyzes floor plans and property data to provide comprehensive inspection reports, compliance checks, and potential issue detection.
        </p>
        <div className="flex gap-4">
          <Button 
            size={isMobile ? "default" : "lg"}
            onClick={() => navigate("/demo")}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Try Demo
          </Button>
          <Button 
            size={isMobile ? "default" : "lg"}
            variant="outline"
            onClick={() => navigate("/waitlist")}
          >
            Join Waitlist
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-medium text-primary text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className="glass-card p-8 rounded-xl flex flex-col">
                <h3 className="text-xl font-heading font-medium text-primary mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">
                    {tier.price === "Custom" ? tier.price : `$${tier.price}`}
                  </span>
                  {tier.price !== "Custom" && <span className="text-muted-foreground">/inspection</span>}
                </div>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={tier.name === "Professional" ? "default" : "outline"}
                  onClick={() => navigate("/contact")}
                >
                  {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <div className="mt-8 flex flex-col items-center gap-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>877-595-5672</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>13355 Noel Road, Suite 1100 - Dallas, TX 75240</span>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-xl">
            <h3 className="text-xl font-heading font-medium text-primary mb-4">Premium Land Plots</h3>
            <p className="text-muted-foreground">
              Carefully curated land listings in prime locations, perfect for your future home.
            </p>
          </div>
          <div className="glass-card p-8 rounded-xl">
            <h3 className="text-xl font-heading font-medium text-primary mb-4">Custom Floor Plans</h3>
            <p className="text-muted-foreground">
              Browse and customize floor plans that match your lifestyle and preferences.
            </p>
          </div>
          <div className="glass-card p-8 rounded-xl">
            <h3 className="text-xl font-heading font-medium text-primary mb-4">Expert Guidance</h3>
            <p className="text-muted-foreground">
              Professional support throughout your journey from land selection to final build.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
