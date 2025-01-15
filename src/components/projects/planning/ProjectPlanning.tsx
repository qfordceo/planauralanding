import { ProjectRoadmap } from "./ProjectRoadmap";
import { ResourceAllocation } from "./ResourceAllocation";
import { MilestoneTracker } from "@/components/milestones/MilestoneTracker";

interface ProjectPlanningProps {
  projectId: string;
}

export function ProjectPlanning({ projectId }: ProjectPlanningProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResourceAllocation projectId={projectId} />
        <MilestoneTracker projectId={projectId} />
      </div>
      <ProjectRoadmap projectId={projectId} />
    </div>
  );
}