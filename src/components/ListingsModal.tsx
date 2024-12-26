import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { InfoIcon } from "lucide-react";

interface ListingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ListingsModal({ open, onOpenChange }: ListingsModalProps) {
  const { toast } = useToast();

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ["land-listings"],
    queryFn: async () => {
      console.log("Fetching listings from database");
      const { data, error } = await supabase
        .from("land_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }
      console.log("Fetched listings:", data);
      return data;
    },
    enabled: open, // Only fetch when modal is open
  });

  // Check if we should fetch new listings and trigger the scrape if needed
  useEffect(() => {
    if (open) {
      console.log("Checking if we should fetch new listings");
      supabase.rpc('should_fetch_listings')
        .single()
        .then(({ data: shouldFetch, error }) => {
          if (error) {
            console.error("Error checking fetch status:", error);
            return;
          }

          console.log("Should fetch new listings:", shouldFetch);
          if (shouldFetch) {
            console.log("Triggering scrape function");
            supabase.functions
              .invoke("scrape-listings")
              .then((response) => {
                console.log("Scrape response:", response);
                if (response.data.success) {
                  // Refetch the listings after successful scrape
                  refetch();
                  toast({
                    title: "Success",
                    description: "Latest listings fetched successfully",
                  });
                } else {
                  toast({
                    title: "Error",
                    description: "Failed to fetch latest listings",
                    variant: "destructive",
                  });
                }
              })
              .catch((error) => {
                console.error("Error invoking scrape function:", error);
                toast({
                  title: "Error",
                  description: "Failed to fetch latest listings",
                  variant: "destructive",
                });
              });
          } else {
            console.log("Using cached listings (less than 24 hours old)");
          }
        });
    }
  }, [open, toast, refetch]);

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
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {listings.map((listing) => (
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
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-2">No listings available</p>
            <p className="text-sm text-muted-foreground">
              Check back later for new listings
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}