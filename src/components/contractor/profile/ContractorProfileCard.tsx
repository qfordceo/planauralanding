import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceBadge, BadgeType } from "@/components/contractor/badges/PerformanceBadge";
import { PerformanceStats } from "@/components/contractor/analytics/PerformanceStats";
import { ContractorReviews } from "@/components/contractor/ContractorReviews";
import { Briefcase, CheckCircle } from "lucide-react";
import { Contractor } from "@/types/contractor";

interface ContractorProfileCardProps {
  contractor: Contractor;
  badges: BadgeType[];
}

export function ContractorProfileCard({ contractor, badges }: ContractorProfileCardProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {contractor.business_name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {contractor.contact_name}
            </p>
          </div>
          {contractor.insurance_verified && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Specialties */}
        <div>
          <h3 className="text-sm font-medium mb-2">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {contractor.contractor_types.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
        </div>

        {/* Performance Badges */}
        <div>
          <h3 className="text-sm font-medium mb-2">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <PerformanceBadge 
                key={badge} 
                type={badge} 
                earned={true}
              />
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <PerformanceStats contractorId={contractor.id} />

        {/* Reviews */}
        <div>
          <h3 className="text-sm font-medium mb-2">Client Reviews</h3>
          <ContractorReviews contractorId={contractor.id} />
        </div>
      </CardContent>
    </Card>
  );
}