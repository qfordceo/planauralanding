import React from 'react';

interface TimelineEventContentProps {
  event: {
    title: string;
    extendedProps: {
      contractor?: string;
    };
  };
}

export function TimelineEventContent({ event }: TimelineEventContentProps) {
  return (
    <div className="p-1 text-xs">
      <div className="font-medium">{event.title}</div>
      {event.extendedProps.contractor && (
        <div className="text-muted-foreground">
          {event.extendedProps.contractor}
        </div>
      )}
    </div>
  );
}