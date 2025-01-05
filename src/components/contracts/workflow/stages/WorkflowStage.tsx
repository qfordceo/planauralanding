import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowStageIndicator } from '../WorkflowStageIndicator';
import type { WorkflowStage as StageType } from '../types';

interface WorkflowStageProps {
  title: string;
  stage: StageType;
  children: ReactNode;
}

export function WorkflowStage({ title, stage, children }: WorkflowStageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <WorkflowStageIndicator currentStage={stage} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}