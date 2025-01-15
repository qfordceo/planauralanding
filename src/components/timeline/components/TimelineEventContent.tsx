import { EventContentArg } from '@fullcalendar/core';

export function TimelineEventContent(eventInfo: EventContentArg) {
  const { event } = eventInfo;
  const { contractor, status } = event.extendedProps;

  return (
    <div className="p-1">
      <div className="font-medium">{event.title}</div>
      {contractor && (
        <div className="text-xs text-muted-foreground">
          Contractor: {contractor}
        </div>
      )}
      <div className="text-xs text-muted-foreground">
        Status: {status}
      </div>
    </div>
  );
}