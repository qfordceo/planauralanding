import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Upload } from "lucide-react";

interface WorkersCompFormProps {
  onComplete: () => void;
}

export function WorkersCompForm({ onComplete }: WorkersCompFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workers' Compensation Insurance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceType">Insurance Type</Label>
            <Select>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select insurance type" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="workers_comp">Workers' Compensation</SelectItem>
                <SelectItem value="occupational">Occupational Accident</SelectItem>
                <SelectItem value="self_insured">Self-Insured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input id="policyNumber" placeholder="Enter policy number" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expirationDate">Policy Expiration Date</Label>
            <Input id="expirationDate" type="date" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insuranceDoc">Upload Insurance Document</Label>
            <div className="flex items-center gap-4">
              <Input id="insuranceDoc" type="file" accept=".pdf,.jpg,.png" required />
              <Upload className="h-4 w-4" />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button asChild variant="outline">
              <a 
                href="https://www.tdi.texas.gov/wc/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit TDI Website
              </a>
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}