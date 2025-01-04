import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceBadge } from "@/components/contractor/badges/PerformanceBadge";
import { PerformanceStats } from "@/components/contractor/analytics/PerformanceStats";
import { ReviewsSection } from "@/components/client/reviews/ReviewsSection";
import { Contractor } from "@/types/contractor";
import { ContractorHeader } from "./sections/ContractorHeader";
import { PerformanceMetrics } from "./sections/PerformanceMetrics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";
import type { BadgeType } from "@/types/contractor";

interface ContractorProfileCardProps {
  contractor: Contractor;
  badges: BadgeType[];
}

export function ContractorProfileCard({ contractor, badges }: ContractorProfileCardProps) {
  const { data: metrics } = useQuery({
    queryKey: ['contractor-metrics', contractor.id],
    queryFn: async () => {
      const { data: projects } = await supabase
        .from('contractor_projects')
        .select('start_date, end_date, status')
        .eq('contractor_id', contractor.id);

      const completedProjects = projects?.filter(p => p.status === 'completed') || [];
      const onTimeProjects = completedProjects.filter(p => {
        const endDate = new Date(p.end_date);
        const startDate = new Date(p.start_date);
        const duration = endDate.getTime() - startDate.getTime();
        return duration <= 30 * 24 * 60 * 60 * 1000; // 30 days
      });

      return {
        totalProjects: projects?.length || 0,
        completedProjects: completedProjects.length,
        onTimeRate: completedProjects.length ? 
          (onTimeProjects.length / completedProjects.length) * 100 : 0
      };
    }
  });

  const { data: compliance } = useQuery({
    queryKey: ['contractor-compliance', contractor.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('contractor_compliance_documents')
        .select('document_type, verification_status')
        .eq('contractor_id', contractor.id)
        .eq('verification_status', 'verified');

      return data || [];
    }
  });

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <ContractorHeader contractor={contractor} />
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics && <PerformanceMetrics metrics={metrics} />}

        {compliance && compliance.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Verified Credentials</h3>
            <div className="flex flex-wrap gap-2">
              {compliance.map((doc) => (
                <Badge key={doc.document_type} variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {doc.document_type}
                </Badge>
              ))}
            </div>
          </div>
        )}

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

        <PerformanceStats contractorId={contractor.id} />

        <div className="mt-8">
          <ReviewsSection contractorId={contractor.id} />
        </div>
      </CardContent>
    </Card>
  );
}