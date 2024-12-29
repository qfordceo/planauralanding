import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { DocumentFormData } from "./types";

const documentTypes = [
  "license",
  "insurance",
  "certification",
  "permit",
  "tax_document",
  "background_check",
  "safety_certification",
  "bond",
] as const;

interface DocumentFormFieldsProps {
  form: UseFormReturn<DocumentFormData>;
}

export function DocumentFormFields({ form }: DocumentFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="document_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Document Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="document_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Document Number (Optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="issuing_authority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issuing Authority (Optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expiration_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expiration Date (Optional)</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="file"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Document File</FormLabel>
            <FormControl>
              <Input 
                type="file" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onChange(file);
                }}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}