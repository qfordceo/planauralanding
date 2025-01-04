import { useState } from "react";
import type { ViewMode } from "../types";

export function useAvailabilityState() {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  return {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    isEditingSchedule,
    setIsEditingSchedule,
  };
}