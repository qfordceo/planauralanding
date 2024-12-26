import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ListingCard from "./listings/ListingCard";
import { useListings } from "@/hooks/useListings";

interface ListingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ListingsModal({ open, onOpenChange }: ListingsModalProps) {
  const { listings, isLoading, error } = useListings(open);

  if (error) {
    console.error("Query error:", error);
  }

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
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-destructive mb-2">Failed to load listings</p>
            <p className="text-sm text-muted-foreground">
              Please try again later
            </p>
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
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