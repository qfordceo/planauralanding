import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SSNFieldProps {
  form: UseFormReturn<any>;
  required: boolean;
}

export function SSNField({ form, required }: SSNFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="ssn" className="flex items-center gap-2">
        Social Security Number
        <span className="text-sm text-muted-foreground">(Required for sole proprietors)</span>
      </Label>
      <Input 
        id="ssn"
        type="password"
        placeholder="XXX-XX-XXXX"
        required={required}
        {...form.register("ssn")}
      />
      <p className="text-sm text-muted-foreground">
        Your SSN is required for tax purposes and verification. We recommend obtaining an EIN for enhanced privacy.
      </p>
      <Button asChild variant="outline" className="w-full mt-2">
        <a 
          href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Apply for an EIN (Free via IRS)
        </a>
      </Button>
    </div>
  );
}