import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayScheduleRow } from "./DayScheduleRow";
import { generateTimeSlots } from "../utils/timeUtils";

interface WeeklyScheduleEditorProps {
  availability: any[];
  onSave: (schedule: any[]) => void;
  onCancel: () => void;
}

export function WeeklyScheduleEditor({
  availability,
  onSave,
  onCancel,
}: WeeklyScheduleEditorProps) {
  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const TIME_SLOTS = generateTimeSlots();

  const [schedule, setSchedule] = useState(
    DAYS.map((_, index) => {
      const existing = availability?.find(a => a.day_of_week === index);
      return {
        dayOfWeek: index,
        startTime: existing?.start_time || "09:00",
        endTime: existing?.end_time || "17:00",
        isEnabled: !!existing,
      };
    })
  );

  const handleToggleDay = (index: number) => {
    setSchedule(prev =>
      prev.map((d, i) =>
        i === index ? { ...d, isEnabled: !d.isEnabled } : d
      )
    );
  };

  const handleTimeChange = (index: number, type: "startTime" | "endTime", value: string) => {
    setSchedule(prev =>
      prev.map((d, i) =>
        i === index ? { ...d, [type]: value } : d
      )
    );
  };

  const handleSave = () => {
    const scheduleData = schedule
      .filter(day => day.isEnabled)
      .map(({ dayOfWeek, startTime, endTime }) => ({
        contractorId: availability[0]?.contractor_id,
        dayOfWeek,
        startTime,
        endTime,
      }));
    onSave(scheduleData);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold">Set Weekly Schedule</h3>
      <div className="space-y-4">
        {schedule.map((day, index) => (
          <DayScheduleRow
            key={index}
            day={day}
            index={index}
            timeSlots={TIME_SLOTS}
            onToggleDay={handleToggleDay}
            onTimeChange={handleTimeChange}
          />
        ))}
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Clock className="mr-2 h-4 w-4" />
          Save Schedule
        </Button>
      </div>
    </div>
  );
}