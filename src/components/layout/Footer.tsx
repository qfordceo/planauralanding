import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
          <Link to="/privacy-policy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/terms-of-service" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/data-processing-agreement" className="hover:text-foreground">
            Data Processing Agreement
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link to="/legal-agreements" className="hover:text-foreground">
            Legal Agreements
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          Copyright © 2025 Plan Aura, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}