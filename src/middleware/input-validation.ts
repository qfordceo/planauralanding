import { z } from "zod";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";

// Common validation schemas
const commonSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  date: z.string().datetime(),
  price: z.number().min(0),
};

// Sanitize input data
export const sanitizeInput = (data: any): any => {
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data);
  }
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((acc, key) => ({
      ...acc,
      [key]: sanitizeInput(data[key])
    }), {});
  }
  return data;
};

// Validate and sanitize input
export const validateAndSanitize = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> => {
  const sanitizedData = sanitizeInput(data);
  return schema.parseAsync(sanitizedData);
};

export { commonSchemas };