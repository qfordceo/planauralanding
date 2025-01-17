import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { LandListing } from "@/integrations/supabase/types/land-listings";

interface ScrapeResponse {
  success: boolean;
  message?: string;
  error?: string;
  listings?: LandListing[];
}

export function useListings(open: boolean) {
  const { toast } = useToast();

  const { data: listings, isLoading, error, refetch } = useQuery({
    queryKey: ["land-listings"],
    queryFn: async () => {
      console.log("Fetching listings from database");
      const { data, error } = await supabase
        .from("land_listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        throw new Error(error.message);
      }
      
      console.log("Fetched listings:", data);
      return data as LandListing[];
    },
    enabled: open,
    retry: 2,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    if (!open) return;

    console.log("Checking if we should fetch new listings");
    supabase.rpc('should_fetch_listings')
      .then(({ data: shouldFetch, error }) => {
        if (error) {
          console.error("Error checking fetch status:", error);
          return;
        }

        console.log("Should fetch new listings:", shouldFetch);
        if (shouldFetch) {
          console.log("Triggering scrape function");
          supabase.functions
            .invoke<ScrapeResponse>("scrape-listings")
            .then(({ data, error }) => {
              console.log("Scrape response:", { data, error });
              
              if (error) {
                console.error("Edge function error:", error);
                return;
              }

              if (data?.success) {
                refetch();
                toast({
                  title: "Success",
                  description: "Latest listings fetched successfully",
                });
              } else if (data?.error) {
                console.error("Scrape function error:", data.error);
                if (!data.error.includes("No properties found")) {
                  toast({
                    title: "Error",
                    description: "Unable to fetch latest listings. Please try again later.",
                    variant: "destructive",
                  });
                }
              }
            })
            .catch((error) => {
              console.error("Error invoking scrape function:", error);
            });
        } else {
          console.log("Using cached listings (less than 24 hours old)");
        }
      });
  }, [open, toast, refetch]);

  return { listings, isLoading, error };
}