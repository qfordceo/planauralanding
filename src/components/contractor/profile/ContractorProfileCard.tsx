import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerformanceBadge, BadgeType } from "@/components/contractor/badges/PerformanceBadge";
import { PerformanceStats } from "@/components/contractor/analytics/PerformanceStats";
import { ContractorReviews } from "@/components/contractor/ContractorReviews";
import { Briefcase, CheckCircle, Clock, MessageCircle } from "lucide-react";
import { Contractor } from "@/types/contractor";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContractorProfileCardProps {
  contractor: Contractor;
  badges: BadgeType[];
}

export function ContractorProfileCard({ contractor, badges }: ContractorProfileCardProps) {
  // Fetch performance metrics
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

  // Fetch compliance documents
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
              Insurance Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">On-Time Rate</p>
              <p className="text-2xl font-bold">{metrics?.onTimeRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Projects Completed</p>
              <p className="text-2xl font-bold">{metrics?.completedProjects}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Response Rate</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </div>

        {/* Verified Documents */}
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