import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ListingCard } from "@/components/listings/ListingCard";

export function SavedLandPlots() {
  const { data: savedPlots, isLoading } = useQuery({
    queryKey: ['saved-land-plots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('land_listings')
        .select('*')
        .eq('is_vetted', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading saved land plots...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedPlots?.map((plot) => (
        <ListingCard key={plot.id} listing={plot} />
      ))}
    </div>
  );
}