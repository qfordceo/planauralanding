import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment, DaySchedule } from "../types";

interface DayColumnProps {
  date: Date;
  daySchedule: DaySchedule | undefined;
  isExceptionDay: boolean;
  dayAppointments: Appointment[];
  getStatusColor: (status: string) => string;
}

export function DayColumn({
  date,
  daySchedule,
  isExceptionDay,
  dayAppointments,
  getStatusColor,
}: DayColumnProps) {
  return (
    <Card className="h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-medium">
          {format(date, "EEE")}
          <span className="block text-xs text-muted-foreground">
            {format(date, "MMM d")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {isExceptionDay ? (
          <div className="text-xs text-red-500">Unavailable</div>
        ) : daySchedule ? (
          <div className="space-y-2">
            <div className="text-xs">
              {format(parseISO(`2000-01-01T${daySchedule.start_time}`), "h:mm a")} - 
              {format(parseISO(`2000-01-01T${daySchedule.end_time}`), "h:mm a")}
            </div>
            {dayAppointments.length > 0 && (
              <div className="space-y-1">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`text-xs p-1 rounded border ${getStatusColor(appointment.status)}`}
                  >
                    {format(parseISO(`2000-01-01T${appointment.start_time}`), "h:mm a")}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">No availability</div>
        )}
      </CardContent>
    </Card>
  );
}