import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
  filters: {
    bedrooms: string;
    priceRange: string;
    squareFootage: string;
    style: string;
  };
  setFilters: (filters: any) => void;
}

export function FloorPlanFilters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Select
        value={filters.bedrooms}
        onValueChange={(value) => setFilters((prev: any) => ({ ...prev, bedrooms: value }))}
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
        onValueChange={(value) => setFilters((prev: any) => ({ ...prev, priceRange: value }))}
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
        onValueChange={(value) => setFilters((prev: any) => ({ ...prev, squareFootage: value }))}
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
        onValueChange={(value) => setFilters((prev: any) => ({ ...prev, style: value }))}
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
  );
}