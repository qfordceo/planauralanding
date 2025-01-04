import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ListingCard } from "./ListingCard";
import { useListings } from "@/hooks/useListings";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface ListingsSectionProps {
  session: Session | null;
}

export function ListingsSection({ session }: ListingsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { listings, isLoading } = useListings(isModalOpen);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleVetListing = async (listingId: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to vet listings",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('land_listings')
        .update({ is_vetted: true })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Listing has been vetted",
      });
    } catch (error) {
      console.error('Error vetting listing:', error);
      toast({
        title: "Error",
        description: "Failed to vet listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateQR = async (listingId: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to generate QR codes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('generate-qr-code', {
        body: { listingId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "QR code has been generated",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Available Land Listings</h1>
        <div className="space-x-4">
          {!session ? (
            <Button onClick={() => navigate("/auth")} variant="outline">
              Sign In
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate("/floor-plans")}>
                Browse Floor Plans
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>
                Update Listings
              </Button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading listings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings?.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard listing={listing} />
              {session?.user && (
                <div className="absolute top-2 right-2 space-x-2">
                  {!listing.is_vetted && (
                    <Button
                      size="sm"
                      onClick={() => handleVetListing(listing.id)}
                    >
                      Vet Listing
                    </Button>
                  )}
                  {listing.is_vetted && !listing.qr_code_generated && (
                    <Button
                      size="sm"
                      onClick={() => handleGenerateQR(listing.id)}
                    >
                      Generate QR
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}