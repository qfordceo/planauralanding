import React from "react"
import { Progress } from "@/components/ui/progress"

interface Milestone {
  status: string
}

interface MilestoneProgressProps {
  milestones: Milestone[]
}

export function MilestoneProgress({ milestones }: MilestoneProgressProps) {
  const completedCount = milestones.filter(
    (m) => m.status === "completed"
  ).length
  const progress = (completedCount / milestones.length) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Project Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}