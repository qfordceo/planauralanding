import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface LicenseVerificationProps {
  contractorId: string;
  onVerificationComplete?: () => void;
}

export function LicenseVerification({ contractorId, onVerificationComplete }: LicenseVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  
  const verifyLicense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);
    
    const formData = new FormData(event.currentTarget);
    const licenseData = {
      licenseNumber: formData.get('licenseNumber') as string,
      licenseType: formData.get('licenseType') as string,
      state: formData.get('state') as string,
    };

    try {
      const { data, error } = await supabase.functions.invoke('verify-license', {
        body: licenseData
      });

      if (error) throw error;

      if (data.isValid) {
        toast({
          title: "License Verified",
          description: "Your license has been successfully verified.",
        });
        
        // Update contractor compliance documents
        await supabase
          .from('contractor_compliance_documents')
          .insert({
            contractor_id: contractorId,
            document_type: 'license',
            document_number: licenseData.licenseNumber,
            verification_status: 'verified',
            expiration_date: data.expirationDate
          });

        onVerificationComplete?.();
      } else {
        toast({
          title: "Verification Failed",
          description: "Unable to verify license. Please check the details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('License verification error:', error);
      toast({
        title: "Error",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>License Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={verifyLicense} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              placeholder="Enter your license number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseType">License Type</Label>
            <Input
              id="licenseType"
              name="licenseType"
              placeholder="e.g., General Contractor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              placeholder="e.g., TX"
              required
            />
          </div>

          <Button type="submit" disabled={isVerifying} className="w-full">
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify License'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}