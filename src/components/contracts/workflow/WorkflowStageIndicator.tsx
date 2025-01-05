import { Check, CircleDot } from "lucide-react";
import type { WorkflowStage } from "./types";

interface WorkflowStageIndicatorProps {
  currentStage: WorkflowStage;
}

export function WorkflowStageIndicator({ currentStage }: WorkflowStageIndicatorProps) {
  const stages: { key: WorkflowStage; label: string }[] = [
    { key: "setup", label: "Setup" },
    { key: "review", label: "Review" },
    { key: "signing", label: "Signing" },
    { key: "completed", label: "Completed" }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.key === currentStage);
  };

  return (
    <div className="flex items-center justify-between w-full mb-8">
      {stages.map((stage, index) => {
        const currentIndex = getCurrentStageIndex();
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={stage.key} className="flex flex-col items-center flex-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2
                ${isComplete ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200'}
                ${index !== stages.length - 1 ? 'relative after:content-[""] after:absolute after:left-full after:top-1/2 after:w-full after:h-0.5 after:bg-gray-200' : ''}
              `}
            >
              {isComplete ? (
                <Check className="w-4 h-4 text-white" />
              ) : isCurrent ? (
                <CircleDot className="w-4 h-4 text-white" />
              ) : null}
            </div>
            <span className="text-sm text-gray-600">{stage.label}</span>
          </div>
        );
      })}
    </div>
  );
}