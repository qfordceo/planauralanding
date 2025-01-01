import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BBBVerificationFormProps {
  onComplete: () => void;
}

export function BBBVerificationForm({ onComplete }: BBBVerificationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>BBB Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bbbId">BBB Business ID</Label>
            <Input id="bbbId" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rating">BBB Rating</Label>
            <Input id="rating" required />
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
}