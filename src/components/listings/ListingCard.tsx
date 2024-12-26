import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    acres: number;
    address: string;
    realtor_url: string;
    image_url: string;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card key={listing.id} className="overflow-hidden">
      {listing.image_url && (
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{listing.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {listing.address}
        </p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold">
            ${listing.price?.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {listing.acres} acres
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <InfoIcon className="h-4 w-4" />
                  ${Math.round(listing.price / listing.acres).toLocaleString()}/acre
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Price per acre in this area</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <a
          href={listing.realtor_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          View Details →
        </a>
      </CardFooter>
    </Card>
  );
}