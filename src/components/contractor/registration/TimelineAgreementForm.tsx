import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TimelineAgreementFormProps {
  onComplete: () => void;
}

export function TimelineAgreementForm({ onComplete }: TimelineAgreementFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Agreement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms1" required />
              <Label htmlFor="terms1">I agree to complete projects within the specified timeline</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms2" required />
              <Label htmlFor="terms2">I understand that delays may result in penalties</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms3" required />
              <Label htmlFor="terms3">I accept Plan Aura's oversight as a consulting entity</Label>
            </div>
          </div>
          <Button type="submit" className="w-full">Complete Registration</Button>
        </form>
      </CardContent>
    </Card>
  );
}