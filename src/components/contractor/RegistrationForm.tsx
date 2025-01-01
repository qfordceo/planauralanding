import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import type { ContractorFormData } from "@/types/contractor";

interface RegistrationFormProps {
  onSubmit: (data: ContractorFormData) => Promise<void>;
  loading: boolean;
}

export function RegistrationForm({ onSubmit, loading }: RegistrationFormProps) {
  const navigate = useNavigate();
  const [showCompliance, setShowCompliance] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    await onSubmit({
      business_name: formData.get('businessName') as string,
      contact_name: formData.get('contactName') as string,
      phone: formData.get('phone') as string,
      contractor_types: ['general'] // Default to general contractor for now
    });

    // After successful registration, show compliance info
    setShowCompliance(true);
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Contractor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {!showCompliance ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" name="businessName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input id="contactName" name="contactName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Profile..." : "Complete Registration"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  To start accepting jobs, you'll need to complete our compliance process.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => navigate("/contractor-registration/business-entity")}
                className="w-full"
              >
                Start Compliance Process
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}