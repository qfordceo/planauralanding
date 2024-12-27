import { useState, useCallback } from 'react';
import { z } from 'zod';

// Common validation schemas
export const financialSchema = z.object({
  amount: z.number()
    .min(0, "Amount must be positive")
    .max(1000000000, "Amount exceeds maximum limit"),
  currency: z.string().length(3),
});

export const personalInfoSchema = z.object({
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  address: z.string().min(5, "Address is too short").max(200, "Address is too long"),
});

interface ValidationError {
  path: string[];
  message: string;
}

export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = useCallback((data: unknown): data is T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.errors);
      return false;
    }
    setErrors([]);
    return true;
  }, [schema]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    validate,
    clearErrors,
  };
}