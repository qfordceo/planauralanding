import React from "react";
import { format, parseISO } from "date-fns";
import type { Appointment } from "../types";

interface AppointmentListProps {
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
}

export function AppointmentList({ appointments, getStatusColor }: AppointmentListProps) {
  return (
    <div className="space-y-2">
      <div className="font-medium">Appointments:</div>
      {appointments.length === 0 ? (
        <div className="text-muted-foreground">No appointments scheduled</div>
      ) : (
        <div className="space-y-2">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`p-2 rounded border ${getStatusColor(appointment.status)}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  {format(parseISO(`2000-01-01T${appointment.start_time}`), "h:mm a")} - 
                  {format(parseISO(`2000-01-01T${appointment.end_time}`), "h:mm a")}
                </div>
                <div className="capitalize text-sm">{appointment.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}