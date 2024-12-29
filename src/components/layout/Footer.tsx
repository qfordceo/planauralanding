import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t">
      <div className="container mx-auto flex items-center justify-center space-x-4 text-sm text-muted-foreground">
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
      </div>
    </footer>
  );
}