import React from "react";
import { format, parseISO } from "date-fns";
import type { DaySchedule } from "../types";

interface DayScheduleDisplayProps {
  daySchedule: DaySchedule;
}

export function DayScheduleDisplay({ daySchedule }: DayScheduleDisplayProps) {
  return (
    <div className="space-y-2">
      <div>Available Hours:</div>
      <div className="text-lg">
        {format(parseISO(`2000-01-01T${daySchedule.start_time}`), "h:mm a")} - 
        {format(parseISO(`2000-01-01T${daySchedule.end_time}`), "h:mm a")}
      </div>
    </div>
  );
}