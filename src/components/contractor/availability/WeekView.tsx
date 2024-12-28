import { format, addDays, startOfWeek, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContractorDayException } from "@/types/contractor"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface WeekViewProps {
  selectedDate: Date
  weeklyAvailability: any[] // Replace with proper type
  dayExceptions?: ContractorDayException[]
  contractorId: string
}

interface Appointment {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  status: string
  client_id: string
}

export function WeekView({ selectedDate, weeklyAvailability, dayExceptions, contractorId }: WeekViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  useEffect(() => {
    // Subscribe to real-time appointments
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
        (payload) => {
          // Refresh appointments when changes occur
          fetchAppointments()
        }
      )
      .subscribe()

    const fetchAppointments = async () => {
      const startDate = format(weekStart, "yyyy-MM-dd")
      const endDate = format(addDays(weekStart, 6), "yyyy-MM-dd")

      const { data } = await supabase
        .from('contractor_appointments')
        .select('*')
        .eq('contractor_id', contractorId)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)

      if (data) {
        setAppointments(data)
      }
    }

    fetchAppointments()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [contractorId, weekStart])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300'
      case 'confirmed':
        return 'bg-green-100 border-green-300'
      case 'completed':
        return 'bg-blue-100 border-blue-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const getDayAppointments = (date: Date) => {
    return appointments.filter(
      app => app.appointment_date === format(date, "yyyy-MM-dd")
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {weekDays.map((date, index) => {
        const daySchedule = weeklyAvailability?.find(
          schedule => schedule.day_of_week === date.getDay()
        )
        const isExceptionDay = dayExceptions?.some(
          ex => ex.exception_date === format(date, "yyyy-MM-dd")
        )
        const dayAppointments = getDayAppointments(date)

        return (
          <Card key={index} className="h-full">
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
        )
      })}
    </div>
  )
}