import { ProjectOverview } from "../tabs/ProjectOverview";

interface ProjectHeaderProps {
  title: string;
  description: string;
}

export function ProjectHeader({ title, description }: ProjectHeaderProps) {
  return <ProjectOverview title={title} description={description} />;
}