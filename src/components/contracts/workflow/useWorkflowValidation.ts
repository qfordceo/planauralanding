import { useState } from "react";

interface ValidationError {
  message: string;
  field?: string;
}

export function useWorkflowValidation() {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStageTransition = (currentStage: string, nextStage: string) => {
    const errors: ValidationError[] = [];
    
    // Validate stage progression
    const stages = ['draft', 'client_review', 'contractor_review', 'completed'];
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = stages.indexOf(nextStage);
    
    if (nextIndex - currentIndex !== 1) {
      errors.push({
        message: `Invalid stage transition from ${currentStage} to ${nextStage}`
      });
    }

    setErrors(errors);
    return errors.length === 0;
  };

  const clearErrors = () => setErrors([]);

  return {
    errors,
    validateStageTransition,
    clearErrors
  };
}