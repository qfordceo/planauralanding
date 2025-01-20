import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { Resource, Event } from "./types";
import { toast } from "sonner";

interface AllocationCalendarProps {
  resources: Resource[];
  events: Event[];
  availability: any[];
  onEventDrop: (info: any) => void;
}

export function AllocationCalendar({ 
  resources, 
  events, 
  availability, 
  onEventDrop 
}: AllocationCalendarProps) {
  const handleEventDrop = async (info: any) => {
    const { event, resource } = info;
    
    const isAvailable = availability?.some((slot: any) => 
      slot.contractor_id === resource.id &&
      new Date(event.start).getDay() === slot.day_of_week
    );

    if (!isAvailable) {
      toast.error("Contractor is not available at this time");
      info.revert();
      return;
    }

    onEventDrop(info);
  };

  return (
    <FullCalendar
      plugins={[resourceTimelinePlugin, interactionPlugin]}
      initialView="resourceTimelineWeek"
      editable={true}
      droppable={true}
      resources={resources}
      events={events}
      eventDrop={handleEventDrop}
      slotMinTime="06:00:00"
      slotMaxTime="20:00:00"
      businessHours={true}
      height="auto"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
      }}
    />
  );
}