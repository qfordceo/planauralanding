import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContractorFormData } from "@/types/contractor";

interface RegistrationFormProps {
  onSubmit: (data: ContractorFormData) => Promise<void>;
  loading: boolean;
}

export function RegistrationForm({ onSubmit, loading }: RegistrationFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    await onSubmit({
      business_name: formData.get('businessName') as string,
      contact_name: formData.get('contactName') as string,
      phone: formData.get('phone') as string,
      contractor_types: ['general'] // Default to general contractor for now
    });
  };

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Contractor Profile</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}