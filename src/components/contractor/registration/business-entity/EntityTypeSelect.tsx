import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-2">
      <Label htmlFor="entityType">Entity Type</Label>
      <Select 
        onValueChange={onChange} 
        defaultValue={value}
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
  );
}