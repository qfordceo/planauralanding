import { format, parseISO } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ContractorDayException } from "@/types/contractor"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface DayViewProps {
  selectedDate: Date
  weeklyAvailability: any[] // Replace with proper type
  dayExceptions?: ContractorDayException[]
  contractorId: string
}

interface Appointment {
  id: string
  start_time: string
  end_time: string
  status: string
  client_id: string
}

export function DayView({ selectedDate, weeklyAvailability, dayExceptions, contractorId }: DayViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const dayOfWeek = selectedDate.getDay()
  const formattedDate = format(selectedDate, "EEEE, MMMM d, yyyy")
  
  const daySchedule = weeklyAvailability?.find(
    schedule => schedule.day_of_week === dayOfWeek
  )

  const isExceptionDay = dayExceptions?.some(
    ex => ex.exception_date === format(selectedDate, "yyyy-MM-dd")
  )

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
      const { data } = await supabase
        .from('contractor_appointments')
        .select('*')
        .eq('contractor_id', contractorId)
        .eq('appointment_date', format(selectedDate, "yyyy-MM-dd"))

      if (data) {
        setAppointments(data)
      }
    }

    fetchAppointments()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [contractorId, selectedDate])

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
            <div className="space-y-2">
              <div>Available Hours:</div>
              <div className="text-lg">
                {format(parseISO(`2000-01-01T${daySchedule.start_time}`), "h:mm a")} - 
                {format(parseISO(`2000-01-01T${daySchedule.end_time}`), "h:mm a")}
              </div>
            </div>
            
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
          </div>
        ) : (
          <div className="text-muted-foreground">No availability set for this day</div>
        )}
      </CardContent>
    </Card>
  )
}