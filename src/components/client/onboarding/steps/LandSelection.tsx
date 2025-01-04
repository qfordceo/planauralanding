import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "@/components/listings/ListingCard";
import { Loader2 } from "lucide-react";

interface LandSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function LandSelection({ onNext, onBack }: LandSelectionProps) {
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const { data: listings, isLoading } = useQuery({
    queryKey: ['land-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('land_listings')
        .select('*')
        .eq('is_vetted', true);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Select Your Perfect Plot
        </h3>
        <p className="text-muted-foreground">
          Browse through our vetted land listings
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings?.map((listing) => (
            <div
              key={listing.id}
              onClick={() => setSelectedListing(listing.id)}
              className={`cursor-pointer transition-all ${
                selectedListing === listing.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Pre-qualification
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedListing}
        >
          Continue to Floor Plans
        </Button>
      </div>
    </div>
  );
}