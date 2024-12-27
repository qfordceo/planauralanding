import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface BuildConsultingProps {
  profile: any;
}

export function BuildConsulting({ profile }: BuildConsultingProps) {
  const calculateConsultingFee = (squareFeet: number) => {
    const feePerSqFt = 6; // $6 per square foot
    return squareFeet * feePerSqFt;
  };

  const handlePayment = () => {
    // Will be implemented when payment API is ready
    console.log("Processing payment");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Consulting Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-lg">
            Our build consulting service includes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Personalized design consultation</li>
            <li>Material selection guidance</li>
            <li>Construction timeline planning</li>
            <li>Budget optimization</li>
            <li>Contractor coordination</li>
          </ul>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-semibold">Consulting Fee: $5-7 per square foot</p>
            <p className="text-sm text-muted-foreground">
              Final fee will be calculated based on your floor plan selection
            </p>
          </div>
          <Button onClick={handlePayment} className="w-full">
            Get Started with Build Consulting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}