import { Calendar, Clock, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewMode = "month" | "week" | "day"

interface ViewSelectorProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={currentView === "month" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("month")}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Month
      </Button>
      <Button
        variant={currentView === "week" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("week")}
      >
        <CalendarDays className="mr-2 h-4 w-4" />
        Week
      </Button>
      <Button
        variant={currentView === "day" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("day")}
      >
        <Clock className="mr-2 h-4 w-4" />
        Day
      </Button>
    </div>
  )
}