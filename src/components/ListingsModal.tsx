import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ListingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ListingsModal({ open, onOpenChange }: ListingsModalProps) {
  const { data: listings, isLoading } = useQuery({
    queryKey: ["land-listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("land_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Available Land Listings</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {listings?.map((listing) => (
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
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      ${listing.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {listing.acres} acres
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <a
                    href={listing.realtor_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View on Realtor.com →
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}