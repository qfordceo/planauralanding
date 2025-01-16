import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WelcomeSection() {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-r from-accent/10 to-accent/5">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Start Your Build Journey</h2>
            <p className="text-muted-foreground">
              Upload your floor plan or explore our curated collection to begin your custom home building journey.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate("/floor-plans/upload")}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Floor Plan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/floor-plans")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Browse Floor Plans
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            {/* Placeholder for future illustration/graphic */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}