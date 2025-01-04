import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { DayScheduleDisplay } from "./DayScheduleDisplay";
import { AppointmentList } from "./AppointmentList";
import type { Appointment } from "../types";

interface DayViewProps {
  selectedDate: Date;
  weeklyAvailability: any[];
  dayExceptions?: any[];
  contractorId: string;
}

export function DayView({
  selectedDate,
  weeklyAvailability,
  dayExceptions,
  contractorId,
}: DayViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const dayOfWeek = selectedDate.getDay();
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy");
  
  const daySchedule = weeklyAvailability?.find(
    schedule => schedule.day_of_week === dayOfWeek
  );

  const isExceptionDay = dayExceptions?.some(
    ex => ex.exception_date === format(selectedDate, "yyyy-MM-dd")
  );

  useEffect(() => {
    const channel = supabase
      .channel('public:contractor_appointments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_appointments',
          filter: `contractor_id=eq.${contractorId}`
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    const fetchAppointments = async () => {
      const { data } = await supabase
        .from('contractor_appointments')
        .select('*')
        .eq('contractor_id', contractorId)
        .eq('appointment_date', format(selectedDate, "yyyy-MM-dd"));

      if (data) {
        setAppointments(data);
      }
    };

    fetchAppointments();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contractorId, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 border-green-300';
      case 'completed':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent>
        {isExceptionDay ? (
          <div className="text-red-500">Marked as unavailable</div>
        ) : daySchedule ? (
          <div className="space-y-4">
            <DayScheduleDisplay daySchedule={daySchedule} />
            <AppointmentList 
              appointments={appointments}
              getStatusColor={getStatusColor}
            />
          </div>
        ) : (
          <div className="text-muted-foreground">No availability set for this day</div>
        )}
      </CardContent>
    </Card>
  );
}