import { ProjectRoadmap } from "./ProjectRoadmap";
import { ResourceAllocation } from "./ResourceAllocation";

interface ProjectPlanningProps {
  projectId: string;
}

export function ProjectPlanning({ projectId }: ProjectPlanningProps) {
  return (
    <div className="space-y-6">
      <ProjectRoadmap projectId={projectId} />
      <ResourceAllocation projectId={projectId} />
    </div>
  );
}