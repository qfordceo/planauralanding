import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { useState } from "react";
import { TimelineHeader } from "./timeline/TimelineHeader";
import { TimelineStep } from "./timeline/TimelineStep";
import { useTimelineMilestones } from "./timeline/useTimelineMilestones";

interface ProjectTimelineProps {
  projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { milestones, isLoading, approveMilestoneMutation } = useTimelineMilestones(projectId);

  const filteredMilestones = milestones?.filter(milestone => {
    const matchesSearch = 
      milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      milestone.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || milestone.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Construction className="h-5 w-5" />
          Building Progress
        </CardTitle>
        <TimelineHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {filteredMilestones?.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              isLast={index === (milestones.length - 1)}
              onApprove={(milestoneId) => approveMilestoneMutation.mutate(milestoneId)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}