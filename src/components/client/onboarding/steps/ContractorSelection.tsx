import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star } from "lucide-react";
import { PerformanceBadge } from "@/components/contractor/badges/PerformanceBadge";

interface ContractorSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContractorSelection({ onNext, onBack }: ContractorSelectionProps) {
  const [selectedContractor, setSelectedContractor] = useState<string | null>(null);

  const { data: contractors, isLoading } = useQuery({
    queryKey: ['contractors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractors')
        .select(`
          *,
          contractor_badges (
            badge_type,
            earned_at
          )
        `)
        .eq('stripe_account_enabled', true);
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-2">
          Select Your Contractor
        </h3>
        <p className="text-muted-foreground">
          Choose from our verified contractors
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {contractors?.map((contractor) => (
            <Card
              key={contractor.id}
              className={`p-6 cursor-pointer transition-all ${
                selectedContractor === contractor.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedContractor(contractor.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{contractor.business_name}</h4>
                  <p className="text-sm text-muted-foreground">{contractor.contact_name}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{contractor.average_rating?.toFixed(1) || "New"}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {contractor.contractor_badges?.map((badge: any) => (
                  <PerformanceBadge 
                    key={`${badge.badge_type}-${badge.earned_at}`}
                    type={badge.badge_type}
                  />
                ))}
              </div>

              <div className="mt-4">
                <Badge variant="outline">
                  {contractor.business_classification}
                </Badge>
                {contractor.has_workers_comp && (
                  <Badge variant="outline" className="ml-2">
                    Workers Comp
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back to Materials
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedContractor}
        >
          Complete Selection
        </Button>
      </div>
    </div>
  );
}