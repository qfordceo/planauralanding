import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface FloorPlan {
  name: string;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  plan_price: number;
  style?: string;
  image_url?: string;
}

export function FloorPlanCard({ plan }: { plan: FloorPlan }) {
  return (
    <Card className="overflow-hidden">
      {plan.image_url && (
        <img 
          src={plan.image_url} 
          alt={plan.name} 
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Bedrooms:</dt>
            <dd>{plan.bedrooms}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Bathrooms:</dt>
            <dd>{plan.bathrooms}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Square Feet:</dt>
            <dd>{plan.square_feet.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Plan Price:</dt>
            <dd>{formatPrice(plan.plan_price)}</dd>
          </div>
          {plan.style && (
            <div className="flex justify-between">
              <dt>Style:</dt>
              <dd className="capitalize">{plan.style}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}