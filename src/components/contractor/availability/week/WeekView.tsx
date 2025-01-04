import React, { useEffect, useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { DayColumn } from "./DayColumn";
import type { Appointment } from "../types";

interface WeekViewProps {
  selectedDate: Date;
  weeklyAvailability: any[];
  dayExceptions?: any[];
  contractorId: string;
}

export function WeekView({
  selectedDate,
  weeklyAvailability,
  dayExceptions,
  contractorId,
}: WeekViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

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
      const startDate = format(weekStart, "yyyy-MM-dd");
      const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd");

      const { data } = await supabase
        .from('contractor_appointments')
        .select('*')
        .eq('contractor_id', contractorId)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);

      if (data) {
        setAppointments(data);
      }
    };

    fetchAppointments();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contractorId, weekStart]);

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

  const getDayAppointments = (date: Date) => {
    return appointments.filter(
      app => app.appointment_date === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((date, index) => {
        const daySchedule = weeklyAvailability?.find(
          schedule => schedule.day_of_week === date.getDay()
        );
        const isExceptionDay = dayExceptions?.some(
          ex => ex.exception_date === format(date, "yyyy-MM-dd")
        );
        const dayAppointments = getDayAppointments(date);

        return (
          <DayColumn
            key={index}
            date={date}
            daySchedule={daySchedule}
            isExceptionDay={isExceptionDay}
            dayAppointments={dayAppointments}
            getStatusColor={getStatusColor}
          />
        );
      })}
    </div>
  );
}