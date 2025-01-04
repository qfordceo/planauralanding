export interface TimeSlot {
  hour: number;
  minute: number;
}

export interface DaySchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

export interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  client_id: string;
}

export type ViewMode = "month" | "week" | "day";