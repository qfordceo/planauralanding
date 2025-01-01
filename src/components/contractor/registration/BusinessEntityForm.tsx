import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";

interface BusinessEntityFormProps {
  onComplete: () => void;
}

export function BusinessEntityForm({ onComplete }: BusinessEntityFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Entity Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your business must be registered as a legal entity. If you haven't formed an LLC yet, 
              you can do so through the Texas Secretary of State.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ein">EIN Number</Label>
              <Input id="ein" placeholder="XX-XXXXXXX" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="llcNumber">LLC Number</Label>
              <Input id="llcNumber" placeholder="Texas LLC Number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formation">Formation Date</Label>
              <Input id="formation" type="date" required />
            </div>

            <div className="flex flex-col space-y-4">
              <Button asChild variant="outline">
                <a 
                  href="https://www.sos.state.tx.us/corp/forms_boc.shtml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Texas Secretary of State
                </a>
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}