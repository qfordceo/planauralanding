import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

interface FilingNumberFieldProps {
  form: UseFormReturn<any>;
  stateName: string;
  stateCode: string;
}

export function FilingNumberField({ form, stateName, stateCode }: FilingNumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="filingNumber">
        {stateCode === "TX" 
          ? `Texas LLC Filing Number`
          : `${stateName} Filing Number`}
      </Label>
      <Input 
        id="filingNumber" 
        placeholder="Enter your filing number" 
        required 
        {...form.register("filingNumber")}
      />
      <p className="text-sm text-muted-foreground">
        {stateCode === "TX" 
          ? "This is the number assigned by the Texas Secretary of State when your entity was formed"
          : `This is your entity's filing number from the ${stateName} Secretary of State`}
      </p>
    </div>
  );
}