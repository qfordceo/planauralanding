import { useState } from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minute}`
})

interface WeeklyScheduleEditorProps {
  availability: any[]
  onSave: (schedule: any[]) => void
  onCancel: () => void
}

export function WeeklyScheduleEditor({
  availability,
  onSave,
  onCancel,
}: WeeklyScheduleEditorProps) {
  const [schedule, setSchedule] = useState(
    DAYS.map((_, index) => {
      const existing = availability?.find(a => a.day_of_week === index)
      return {
        dayOfWeek: index,
        startTime: existing?.start_time || "09:00",
        endTime: existing?.end_time || "17:00",
        isEnabled: !!existing,
      }
    })
  )

  const handleSave = () => {
    const scheduleData = schedule
      .filter(day => day.isEnabled)
      .map(({ dayOfWeek, startTime, endTime }) => ({
        contractorId: availability[0]?.contractor_id,
        dayOfWeek,
        startTime,
        endTime,
      }))
    onSave(scheduleData)
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold">Set Weekly Schedule</h3>
      <div className="space-y-4">
        {schedule.map((day, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-32">
              <Button
                variant={day.isEnabled ? "default" : "outline"}
                className="w-full"
                onClick={() =>
                  setSchedule(prev =>
                    prev.map((d, i) =>
                      i === index ? { ...d, isEnabled: !d.isEnabled } : d
                    )
                  )
                }
              >
                {DAYS[day.dayOfWeek]}
              </Button>
            </div>
            {day.isEnabled && (
              <>
                <Select
                  value={day.startTime}
                  onValueChange={(value) =>
                    setSchedule(prev =>
                      prev.map((d, i) =>
                        i === index ? { ...d, startTime: value } : d
                      )
                    )
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select
                  value={day.endTime}
                  onValueChange={(value) =>
                    setSchedule(prev =>
                      prev.map((d, i) =>
                        i === index ? { ...d, endTime: value } : d
                      )
                    )
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
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
  )
}