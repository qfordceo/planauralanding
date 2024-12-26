import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function useListings(open: boolean) {
  const { toast } = useToast();

  const { data: listings, isLoading, error, refetch } = useQuery({
    queryKey: ["land-listings"],
    queryFn: async () => {
      console.log("Fetching listings from database");
      try {
        const { data, error } = await supabase
          .from("land_listings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching listings:", error);
          throw error;
        }
        
        console.log("Fetched listings:", data);
        return data || [];
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        throw err;
      }
    },
    enabled: open,
    retry: 2,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (open) {
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
              .invoke("scrape-listings")
              .then((response) => {
                console.log("Scrape response:", response);
                if (response.data?.success) {
                  refetch();
                  toast({
                    title: "Success",
                    description: "Latest listings fetched successfully",
                  });
                } else {
                  console.error("Scrape function error:", response.error || response.data?.error);
                  toast({
                    title: "Error",
                    description: "Failed to fetch latest listings. Please try again later.",
                    variant: "destructive",
                  });
                }
              })
              .catch((error) => {
                console.error("Error invoking scrape function:", error);
                toast({
                  title: "Error",
                  description: "Failed to fetch latest listings. Please try again later.",
                  variant: "destructive",
                });
              });
          } else {
            console.log("Using cached listings (less than 24 hours old)");
          }
        });
    }
  }, [open, toast, refetch]);

  return { listings, isLoading, error };
}