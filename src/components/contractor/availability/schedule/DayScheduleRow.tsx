import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeSlot } from "../types";

interface DayScheduleRowProps {
  day: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isEnabled: boolean;
  };
  index: number;
  timeSlots: string[];
  onToggleDay: (index: number) => void;
  onTimeChange: (index: number, type: "startTime" | "endTime", value: string) => void;
}

export function DayScheduleRow({
  day,
  index,
  timeSlots,
  onToggleDay,
  onTimeChange,
}: DayScheduleRowProps) {
  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="w-32">
        <Button
          variant={day.isEnabled ? "default" : "outline"}
          className="w-full"
          onClick={() => onToggleDay(index)}
        >
          {DAYS[day.dayOfWeek]}
        </Button>
      </div>
      {day.isEnabled && (
        <>
          <Select
            value={day.startTime}
            onValueChange={(value) => onTimeChange(index, "startTime", value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Start time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>to</span>
          <Select
            value={day.endTime}
            onValueChange={(value) => onTimeChange(index, "endTime", value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="End time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
}