import { format } from "date-fns";
import { useAvailabilityData } from "./hooks/useAvailabilityData";
import { useAvailabilityMutations } from "./hooks/useAvailabilityMutations";
import { useAvailabilityState } from "./hooks/useAvailabilityState";
import { AvailabilityHeader } from "./components/AvailabilityHeader";
import { WeeklyScheduleEditor } from "./WeeklyScheduleEditor";
import { DayView } from "./DayView";
import { WeekView } from "./WeekView";
import { AvailabilityCalendar } from "./AvailabilityCalendar";

export function AvailabilityManager({ contractorId }: { contractorId: string }) {
  const {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    isEditingSchedule,
    setIsEditingSchedule,
  } = useAvailabilityState();
  
  const { weeklyAvailability, dayExceptions, isLoading } = useAvailabilityData(contractorId);
  const { updateAvailabilityMutation, updateDayExceptionMutation } = useAvailabilityMutations(contractorId);

  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const existingException = dayExceptions?.find(
      ex => ex.exception_date === formattedDate
    );
    updateDayExceptionMutation.mutate({
      date: formattedDate,
      isAvailable: !!existingException,
    });
  };

  if (isLoading) {
    return <div>Loading availability...</div>;
  }

  const renderView = () => {
    switch (viewMode) {
      case "day":
        return (
          <DayView 
            selectedDate={selectedDate}
            weeklyAvailability={weeklyAvailability}
            dayExceptions={dayExceptions}
            contractorId={contractorId}
          />
        );
      case "week":
        return (
          <WeekView 
            selectedDate={selectedDate}
            weeklyAvailability={weeklyAvailability}
            dayExceptions={dayExceptions}
            contractorId={contractorId}
          />
        );
      default:
        return (
          <AvailabilityCalendar
            selectedDate={selectedDate}
            onDateSelect={(date) => {
              setSelectedDate(date);
              handleDayClick(date);
            }}
            dayExceptions={dayExceptions}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <AvailabilityHeader
        viewMode={viewMode}
        onViewChange={setViewMode}
        onEditSchedule={() => setIsEditingSchedule(true)}
      />

      {renderView()}

      <div className="text-sm text-muted-foreground">
        Click on a date to mark it as unavailable/available
      </div>

      {isEditingSchedule && (
        <WeeklyScheduleEditor
          availability={weeklyAvailability}
          onSave={async (scheduleData) => {
            await updateAvailabilityMutation.mutateAsync(scheduleData);
            setIsEditingSchedule(false);
          }}
          onCancel={() => setIsEditingSchedule(false)}
        />
      )}
    </div>
  );
}