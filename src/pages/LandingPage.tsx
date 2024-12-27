import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md fixed top-0 z-50">
        <img 
          src="/lovable-uploads/3ced312b-91d4-4b7d-abe6-d7ac97f865c0.png" 
          alt="Plan Aura Logo" 
          className="h-12"
        />
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/listings")}
            className="text-primary hover:text-primary/80"
          >
            Available Land
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/floor-plans")}
            className="text-primary hover:text-primary/80"
          >
            Floor Plans
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
        <h1 className="text-6xl font-heading font-medium text-primary mb-6 tracking-tight">
          Your Dream Home Awaits
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          From finding the perfect plot of land to designing your custom home, 
          we're here to make your journey seamless and inspiring.
        </p>
        <div className="flex gap-4">
          <Button 
            size="lg"
            onClick={() => navigate("/listings")}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Browse Available Land
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/floor-plans")}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Explore Floor Plans
          </Button>
        </div>
      </section>

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