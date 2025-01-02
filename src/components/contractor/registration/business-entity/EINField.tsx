import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

interface EINFieldProps {
  form: UseFormReturn<any>;
  required: boolean;
  showHelperText?: boolean;
}

export function EINField({ form, required, showHelperText }: EINFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="ein" className="flex items-center gap-2">
        EIN Number
        {!required && <span className="text-sm text-muted-foreground">(Recommended)</span>}
      </Label>
      <Input 
        id="ein"
        placeholder="XX-XXXXXXX"
        required={required}
        {...form.register("ein")}
      />
      {showHelperText && (
        <p className="text-sm text-muted-foreground">
          While not required for sole proprietors, an EIN provides better privacy and professionalism.
        </p>
      )}
    </div>
  );
}