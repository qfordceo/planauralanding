import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";

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
            <Label htmlFor="businessType">Business Type</Label>
            <Select>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bbbId">BBB Business ID</Label>
            <Input id="bbbId" placeholder="Enter BBB Business ID" required />
          </div>

          <div className="flex flex-col space-y-4">
            <Button asChild variant="outline">
              <a 
                href="https://www.bbb.org/get-accredited" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit BBB Website
              </a>
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}