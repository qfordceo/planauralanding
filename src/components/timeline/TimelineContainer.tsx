import { GanttTimeline } from "./GanttTimeline";
import { TimelineSummary } from "./TimelineSummary";

interface TimelineContainerProps {
  projectId: string;
}

export function TimelineContainer({ projectId }: TimelineContainerProps) {
  return (
    <div className="space-y-6">
      <TimelineSummary projectId={projectId} />
      <GanttTimeline projectId={projectId} />
    </div>
  );
}