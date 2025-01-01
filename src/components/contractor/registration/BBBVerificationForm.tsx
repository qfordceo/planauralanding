import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";

interface BBBVerificationFormProps {
  onComplete: () => void;
}

export function BBBVerificationForm({ onComplete }: BBBVerificationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>BBB Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Better Business Bureau (BBB) accreditation helps establish trust with potential clients.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bbbId">BBB Business ID</Label>
              <Input id="bbbId" placeholder="Enter BBB ID" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">BBB Rating</Label>
              <Input id="rating" placeholder="Current BBB Rating" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accreditationDate">Accreditation Date</Label>
              <Input id="accreditationDate" type="date" required />
            </div>

            <div className="flex flex-col space-y-4">
              <Button asChild variant="outline">
                <a 
                  href="https://www.bbb.org/get-accredited" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit BBB Accreditation
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