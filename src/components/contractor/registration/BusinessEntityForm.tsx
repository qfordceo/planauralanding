import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessEntityFormProps {
  onComplete: () => void;
}

export function BusinessEntityForm({ onComplete }: BusinessEntityFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Entity Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ein">EIN Number</Label>
            <Input id="ein" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="llcNumber">LLC Number</Label>
            <Input id="llcNumber" required />
          </div>
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
}