import { EventContentArg } from '@fullcalendar/core';
import { Badge } from "@/components/ui/badge";

export function TimelineEventContent(arg: EventContentArg) {
  const { event } = arg;
  const isMilestone = event.extendedProps.type === 'milestone';

  if (isMilestone) {
    return (
      <div className="flex items-center gap-2 p-1">
        <Badge variant="outline" className="text-xs">
          Milestone
        </Badge>
        <span className="text-sm font-medium">{event.title}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{event.title}</span>
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{
            backgroundColor: event.backgroundColor,
            color: '#fff'
          }}
        >
          {event.extendedProps.phase}
        </Badge>
      </div>
      {event.extendedProps.contractor && (
        <span className="text-xs text-muted-foreground">
          {event.extendedProps.contractor}
        </span>
      )}
    </div>
  );
}