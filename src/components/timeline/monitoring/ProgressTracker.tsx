import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  milestones: any[];
  agreedCompletionDate: string;
}

export function ProgressTracker({ milestones, agreedCompletionDate }: ProgressTrackerProps) {
  const calculateProgress = () => {
    if (!milestones?.length) return 0;
    const completed = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completed / milestones.length) * 100);
  };

  const calculateTimeProgress = () => {
    const startDate = new Date(milestones[0]?.due_date || new Date());
    const endDate = new Date(agreedCompletionDate);
    const now = new Date();
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  };

  const progress = calculateProgress();
  const timeProgress = calculateTimeProgress();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Timeline Progress</span>
          <span className="text-sm text-muted-foreground">{timeProgress}%</span>
        </div>
        <Progress value={timeProgress} className="h-2" />
      </div>
    </div>
  );
}