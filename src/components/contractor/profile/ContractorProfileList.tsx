import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractorProfileCard } from "./ContractorProfileCard";
import { BadgeType } from "@/components/contractor/badges/PerformanceBadge";
import { Contractor } from "@/types/contractor";

export function ContractorProfileList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | "">("");

  const { data: contractors, isLoading } = useQuery({
    queryKey: ['contractors', searchTerm, selectedSpecialty, selectedBadge],
    queryFn: async () => {
      let query = supabase
        .from('contractors')
        .select(`
          *,
          contractor_badges (
            badge_type,
            active
          )
        `)
        .eq('contractor_badges.active', true);

      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,contact_name.ilike.%${searchTerm}%`);
      }

      if (selectedSpecialty) {
        query = query.contains('contractor_types', [selectedSpecialty]);
      }

      if (selectedBadge) {
        query = query.eq('contractor_badges.badge_type', selectedBadge);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as (Contractor & { contractor_badges: { badge_type: BadgeType; active: boolean; }[] })[];
    }
  });

  if (isLoading) {
    return <div>Loading contractors...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search contractors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specialties</SelectItem>
            <SelectItem value="general">General Contractor</SelectItem>
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="plumbing">Plumbing</SelectItem>
            <SelectItem value="hvac">HVAC</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedBadge} onValueChange={(value) => setSelectedBadge(value as BadgeType | "")}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by badge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Badges</SelectItem>
            <SelectItem value="expeditious">Expeditious & Efficient</SelectItem>
            <SelectItem value="clientFavorite">Client Favorite</SelectItem>
            <SelectItem value="safety">Safety First</SelectItem>
            <SelectItem value="preferred">Preferred Partner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contractor List */}
      <div className="space-y-6">
        {contractors?.map((contractor) => (
          <ContractorProfileCard
            key={contractor.id}
            contractor={contractor}
            badges={contractor.contractor_badges.map(b => b.badge_type)}
          />
        ))}
      </div>
    </div>
  );
}