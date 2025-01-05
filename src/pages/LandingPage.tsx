import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-2 text-center animate-fade-in">
        🚧 Under Construction - Coming Soon! 🚧
      </div>
      
      {/* Header with Sign In Options */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-end items-center space-x-4">
          <Button asChild variant="ghost">
            <Link to="/auth?type=contractor">Contractor Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?type=client">Client Sign In</Link>
          </Button>
        </div>
      </header>

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
          <p>1234 Inspiration Lane, Suite 100, Scottsdale, AZ 85260</p>
          <p>(480) 555-0123</p>
        </div>

        {/* Legal Links */}
        <div className="border-t pt-8">
          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            <Link to="/data-processing-agreement" className="hover:text-primary">Data Processing Agreement</Link>
            <Link to="/legal-agreements" className="hover:text-primary">Legal Agreements</Link>
            <span>© 2024 Plan Aura LLC. All rights reserved.</span>
          </nav>
        </div>
      </main>
    </div>
  );
}