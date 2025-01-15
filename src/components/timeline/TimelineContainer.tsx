import { GanttTimeline } from "./GanttTimeline";

interface TimelineContainerProps {
  projectId: string;
}

export function TimelineContainer({ projectId }: TimelineContainerProps) {
  return (
    <div className="space-y-6">
      <GanttTimeline projectId={projectId} />
    </div>
  );
}