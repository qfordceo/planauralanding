import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-2 text-center animate-fade-in">
        🚧 Under Construction - Coming Soon! 🚧
      </div>
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Logo and Header Section */}
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/dab4a351-2a72-4ed9-a708-1a30f4933d5e.png" 
            alt="Plan Aura Logo" 
            className="mx-auto h-32 object-contain"
          />
          <h1 className="text-4xl font-bold text-primary">Welcome to Plan Aura</h1>
        </div>

        {/* Sign In Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="text-center space-y-4 p-6 glass-card rounded-lg">
            <h2 className="text-2xl font-semibold text-primary">Contractors</h2>
            <p className="text-muted-foreground">Access your contractor dashboard</p>
            <Button asChild className="w-full">
              <Link to="/auth?type=contractor">Contractor Sign In</Link>
            </Button>
          </div>

          <div className="text-center space-y-4 p-6 glass-card rounded-lg">
            <h2 className="text-2xl font-semibold text-primary">Clients</h2>
            <p className="text-muted-foreground">Start your building journey</p>
            <Button asChild className="w-full">
              <Link to="/auth?type=client">Client Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Waitlist Section */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold">Join Our Waitlist</h2>
          <p className="text-muted-foreground">Be the first to experience Plan Aura when we launch</p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/waitlist">Join Waitlist</Link>
          </Button>
        </div>

        {/* Contact Information */}
        <div className="text-center text-muted-foreground space-y-2">
          <p>Contact Us</p>
          <p>123 Building Avenue, Construction City, CC 12345</p>
          <p>(555) 123-4567</p>
        </div>
      </main>
    </div>
  );
}