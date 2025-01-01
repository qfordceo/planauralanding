import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface WorkersCompFormProps {
  onComplete: () => void;
}

export function WorkersCompForm({ onComplete }: WorkersCompFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Worker's Compensation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Worker's compensation insurance is required unless you qualify for an exemption.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input id="policyNumber" placeholder="Enter policy number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Insurance Provider</Label>
              <Input id="provider" placeholder="Insurance company name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">Policy Expiration Date</Label>
              <Input id="expirationDate" type="date" required />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="waiver" />
              <Label htmlFor="waiver">
                I understand that providing false insurance information may result in immediate termination.
              </Label>
            </div>

            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}