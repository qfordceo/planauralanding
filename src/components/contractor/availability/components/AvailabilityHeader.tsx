import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewSelector } from "../ViewSelector";
import type { ViewMode } from "../types";

interface AvailabilityHeaderProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onEditSchedule: () => void;
}

export function AvailabilityHeader({
  viewMode,
  onViewChange,
  onEditSchedule,
}: AvailabilityHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <ViewSelector
        currentView={viewMode}
        onViewChange={onViewChange}
      />
      <Button
        variant="outline"
        onClick={onEditSchedule}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        Set Weekly Schedule
      </Button>
    </div>
  );
}