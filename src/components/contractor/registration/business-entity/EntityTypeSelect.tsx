import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const entityTypes = [
  { value: "individual", label: "Individual/Sole Proprietorship" },
  { value: "llc", label: "Limited Liability Company (LLC)" },
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "lp", label: "Limited Partnership" },
  { value: "llp", label: "Limited Liability Partnership" }
] as const;

export type EntityType = typeof entityTypes[number]["value"];

interface EntityTypeSelectProps {
  value: EntityType;
  onChange: (value: EntityType) => void;
}

export function EntityTypeSelect({ value, onChange }: EntityTypeSelectProps) {
  const showSoleProprietorWarning = value === "individual";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="entityType">Entity Type</Label>
        <Select 
          onValueChange={onChange} 
          value={value}
        >
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select your business entity type" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg">
            {entityTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showSoleProprietorWarning && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            As a sole proprietor, you'll need to provide additional documentation including:
            <ul className="list-disc pl-5 mt-2">
              <li>Tax identification (EIN recommended, SSN accepted)</li>
              <li>General liability insurance</li>
              <li>Additional liability waivers</li>
            </ul>
            We recommend forming an LLC for better liability protection.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}