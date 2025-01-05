import { useState } from 'react';
import type { WorkflowStage, Contract } from '../types';

export function useWorkflowState() {
  const [currentStage, setCurrentStage] = useState<WorkflowStage>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleStageTransition = (nextStage: WorkflowStage) => {
    setIsLoading(true);
    try {
      setCurrentStage(nextStage);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStage,
    isLoading,
    error,
    handleStageTransition,
    setError,
  };
}