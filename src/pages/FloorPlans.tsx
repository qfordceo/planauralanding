import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FloorPlan {
  name: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  price?: string;
  imageUrl?: string;
}

export default function FloorPlans() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [filters, setFilters] = useState({
    bedrooms: "",
    priceRange: "",
    squareFootage: "",
    style: ""
  });

  useEffect(() => {
    fetchFloorPlans();
  }, []);

  const fetchFloorPlans = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      const { data, error } = await supabase.functions.invoke('scrape-floor-plans', {
        body: { 
          filters: {
            ...filters,
            foundation: 'slab' // Always filter for slab foundations
          }
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load floor plans",
          variant: "destructive",
        });
        return;
      }

      if (data?.html) {
        const parsedPlans = parseFloorPlansData(data.html);
        setFloorPlans(parsedPlans);
      }
    } catch (error) {
      console.error('Error fetching floor plans:', error);
      toast({
        title: "Error",
        description: "Failed to load floor plans",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const parseFloorPlansData = (html: string): FloorPlan[] => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const planElements = doc.querySelectorAll('.plan-item');
      
      return Array.from(planElements).map(element => ({
        name: element.querySelector('.plan-name')?.textContent?.trim() || 'Unnamed Plan',
        bedrooms: element.querySelector('.bedrooms')?.textContent?.trim(),
        bathrooms: element.querySelector('.bathrooms')?.textContent?.trim(),
        squareFeet: element.querySelector('.square-feet')?.textContent?.trim(),
        price: element.querySelector('.price')?.textContent?.trim(),
        imageUrl: element.querySelector('img')?.getAttribute('src') || undefined
      }));
    } catch (error) {
      console.error('Error parsing floor plans:', error);
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dallas/Fort Worth Floor Plans</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Select
          value={filters.bedrooms}
          onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4, 5].map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} Bedrooms
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priceRange}
          onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="200-300">$200k - $300k</SelectItem>
            <SelectItem value="300-400">$300k - $400k</SelectItem>
            <SelectItem value="400-500">$400k - $500k</SelectItem>
            <SelectItem value="500+">$500k+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.squareFootage}
          onValueChange={(value) => setFilters(prev => ({ ...prev, squareFootage: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Square Footage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000-2000">1,000 - 2,000 sqft</SelectItem>
            <SelectItem value="2000-3000">2,000 - 3,000 sqft</SelectItem>
            <SelectItem value="3000-4000">3,000 - 4,000 sqft</SelectItem>
            <SelectItem value="4000+">4,000+ sqft</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.style}
          onValueChange={(value) => setFilters(prev => ({ ...prev, style: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Home Style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="farmhouse">Farmhouse</SelectItem>
            <SelectItem value="ranch">Ranch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <Progress value={progress} className="mb-8" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {floorPlans.map((plan, index) => (
          <Card key={index} className="overflow-hidden">
            {plan.imageUrl && (
              <img 
                src={plan.imageUrl} 
                alt={plan.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                {plan.bedrooms && (
                  <div className="flex justify-between">
                    <dt>Bedrooms:</dt>
                    <dd>{plan.bedrooms}</dd>
                  </div>
                )}
                {plan.bathrooms && (
                  <div className="flex justify-between">
                    <dt>Bathrooms:</dt>
                    <dd>{plan.bathrooms}</dd>
                  </div>
                )}
                {plan.squareFeet && (
                  <div className="flex justify-between">
                    <dt>Square Feet:</dt>
                    <dd>{plan.squareFeet}</dd>
                  </div>
                )}
                {plan.price && (
                  <div className="flex justify-between">
                    <dt>Price:</dt>
                    <dd>{plan.price}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}