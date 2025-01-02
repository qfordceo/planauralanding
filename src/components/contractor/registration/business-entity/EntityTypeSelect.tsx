import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export type EntityType = "individual" | "llc" | "corporation" | "partnership" | "lp" | "llp";

interface EntityTypeSelectProps {
  value: EntityType;
  onChange: (value: EntityType) => void;
  form: UseFormReturn<any>;
}

export function EntityTypeSelect({ value, onChange, form }: EntityTypeSelectProps) {
  const isSoleProprietor = value === "individual";

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="entityType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Entity Type</FormLabel>
            <Select onValueChange={(val) => {
              onChange(val as EntityType);
              field.onChange(val);
            }} value={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="individual">Sole Proprietorship</SelectItem>
                <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="partnership">General Partnership</SelectItem>
                <SelectItem value="lp">Limited Partnership (LP)</SelectItem>
                <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isSoleProprietor && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Operating as a sole proprietor provides no legal separation between personal and business assets.
            We strongly recommend forming an LLC for better protection. Additional documentation and waivers
            will be required for sole proprietors.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}