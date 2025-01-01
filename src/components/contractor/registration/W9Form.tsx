import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info, Upload } from "lucide-react";

interface W9FormProps {
  onComplete: () => void;
}

export function W9Form({ onComplete }: W9FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>W-9 Form Submission</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              A completed W-9 form is required for tax purposes. You can download the latest form from the IRS website.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tin">Taxpayer Identification Number (TIN)</Label>
              <Input id="tin" placeholder="XX-XXXXXXX" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input id="businessType" placeholder="e.g., LLC, Corporation" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="w9File">Upload W-9 Form</Label>
              <div className="flex items-center gap-4">
                <Input id="w9File" type="file" accept=".pdf,.jpg,.png" required />
                <Upload className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button asChild variant="outline">
                <a 
                  href="https://www.irs.gov/forms-pubs/about-form-w-9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Download W-9 Form
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