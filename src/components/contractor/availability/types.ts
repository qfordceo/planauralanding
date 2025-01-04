export type ViewMode = "month" | "week" | "day";

export interface DayException {
  exception_date: string;
  is_available: boolean;
}

export interface WeeklyAvailability {
  day_of_week: number;
  start_time: string;
  end_time: string;
}