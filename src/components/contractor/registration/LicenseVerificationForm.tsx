import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Info, Upload } from "lucide-react";

interface LicenseVerificationFormProps {
  onComplete: () => void;
}

export function LicenseVerificationForm({ onComplete }: LicenseVerificationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please provide your professional license information. This will be verified with the appropriate licensing board.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licenseType">License Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="general">General Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" placeholder="Enter license number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">License Expiration Date</Label>
              <Input id="expirationDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseFile">Upload License Document</Label>
              <div className="flex items-center gap-4">
                <Input id="licenseFile" type="file" accept=".pdf,.jpg,.png" required />
                <Upload className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button asChild variant="outline">
                <a 
                  href="https://www.tdlr.texas.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit TDLR Website
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