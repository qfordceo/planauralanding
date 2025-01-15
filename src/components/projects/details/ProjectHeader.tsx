import { ProjectOverview } from "../tabs/ProjectOverview";

interface ProjectHeaderProps {
  projectId: string;
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  return <ProjectOverview projectId={projectId} />;
}