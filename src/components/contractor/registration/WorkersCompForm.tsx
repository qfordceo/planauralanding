import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface WorkersCompFormProps {
  onComplete: () => void;
}

export function WorkersCompForm({ onComplete }: WorkersCompFormProps) {
  const [hasInsurance, setHasInsurance] = useState<boolean>(true);
  const [signature, setSignature] = useState("");
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const currentDate = format(new Date(), "MMMM d, yyyy");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const agreementText = `This Workers' Compensation Waiver and Indemnification Agreement ("Agreement") is entered into as of ${currentDate}, by and between:

Plan Aura LLC, a Texas Limited Liability Company ("Plan Aura"), and
${signature || "[Contractor's Full Legal Name or Business Entity Name]"} ("Contractor"), collectively referred to as the "Parties."

[... Agreement text continues ...]`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workers' Compensation Insurance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Coverage Option</Label>
            <Select 
              onValueChange={(value) => setHasInsurance(value === "insurance")}
              defaultValue="insurance"
            >
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select coverage option" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                <SelectItem value="insurance">I have Workers' Compensation Insurance</SelectItem>
                <SelectItem value="waiver">I want to sign a waiver</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasInsurance ? (
            <>
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
            </>
          ) : (
            <div className="space-y-4">
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4 text-sm">
                  <p className="whitespace-pre-wrap">{agreementText}</p>
                </div>
              </ScrollArea>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature">E-Signature (Full Legal Name)</Label>
                  <Input 
                    id="signature" 
                    placeholder="Type your full legal name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    required={!hasInsurance}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="agreement" 
                    checked={agreementAccepted}
                    onCheckedChange={(checked) => setAgreementAccepted(checked as boolean)}
                    required={!hasInsurance}
                  />
                  <Label htmlFor="agreement" className="text-sm">
                    I have read and agree to the Workers' Compensation Waiver and Indemnification Agreement
                  </Label>
                </div>
              </div>
            </div>
          )}

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
            <Button 
              type="submit"
              disabled={!hasInsurance && (!signature || !agreementAccepted)}
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}