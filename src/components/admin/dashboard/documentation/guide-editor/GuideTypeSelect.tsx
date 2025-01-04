import { Label } from "@/components/ui/label";

interface GuideTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function GuideTypeSelect({ value, onChange }: GuideTypeSelectProps) {
  return (
    <div>
      <Label htmlFor="type">Guide Type</Label>
      <select
        id="type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-md p-2"
      >
        <option value="client">Client Guide</option>
        <option value="contractor">Contractor Guide</option>
        <option value="admin">Admin Guide</option>
        <option value="general">General Usage</option>
      </select>
    </div>
  );
}