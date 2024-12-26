import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { FloorPlanFilters } from "@/components/floor-plans/FloorPlanFilters";
import { FloorPlanCard } from "@/components/floor-plans/FloorPlanCard";

export default function FloorPlans() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    bedrooms: "",
    priceRange: "",
    squareFootage: "",
    style: ""
  });

  const { data: floorPlans, isLoading, error } = useQuery({
    queryKey: ['floor-plans', filters],
    queryFn: async () => {
      let query = supabase
        .from('floor_plans')
        .select('*');

      if (filters.bedrooms) {
        query = query.eq('bedrooms', parseInt(filters.bedrooms));
      }

      if (filters.style) {
        query = query.eq('style', filters.style);
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(n => parseInt(n) * 1000);
        query = query.gte('price', min);
        if (max) {
          query = query.lt('price', max);
        }
      }

      if (filters.squareFootage) {
        const [min, max] = filters.squareFootage.split('-').map(n => parseInt(n));
        query = query.gte('square_feet', min);
        if (max) {
          query = query.lt('square_feet', max);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching floor plans:', error);
        throw new Error('Failed to fetch floor plans');
      }

      return data;
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load floor plans",
      variant: "destructive",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dallas/Fort Worth Floor Plans</h1>
      
      <FloorPlanFilters filters={filters} setFilters={setFilters} />

      {isLoading && <Progress value={30} className="mb-8" />}
      
      {error && (
        <Alert className="mb-8">
          <AlertDescription>Failed to load floor plans. Please try again later.</AlertDescription>
        </Alert>
      )}

      {floorPlans && floorPlans.length === 0 && (
        <Alert className="mb-8">
          <AlertDescription>No floor plans found matching your criteria.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {floorPlans?.map((plan) => (
          <FloorPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}