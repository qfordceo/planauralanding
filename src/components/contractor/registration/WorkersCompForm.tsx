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

  const agreementText = `Workers' Compensation Waiver and Indemnification Agreement

This Workers' Compensation Waiver and Indemnification Agreement ("Agreement") is entered into as of ${currentDate}, by and between:

Plan Aura LLC, a Texas Limited Liability Company ("Plan Aura"), and
${signature || "[Contractor's Full Legal Name or Business Entity Name]"} ("Contractor"), collectively referred to as the "Parties."

Recitals
WHEREAS, Plan Aura operates as a consulting and project management platform, facilitating connections between clients and independent contractors;

WHEREAS, the Contractor is an independent entity, not an employee, agent, or representative of Plan Aura;

WHEREAS, Plan Aura requires contractors to either provide proof of workers' compensation coverage or execute this Agreement to waive Plan Aura's liability for claims arising from work-related injuries or illnesses;

NOW, THEREFORE, in consideration of the mutual covenants and conditions set forth herein, the Parties agree as follows:

1. Waiver of Workers' Compensation Claims
The Contractor hereby acknowledges and agrees that:
1.1. The Contractor is an independent contractor and not an employee of Plan Aura.
1.2. The Contractor is solely responsible for obtaining and maintaining workers' compensation insurance coverage for itself and its employees, subcontractors, or other personnel engaged in the Contractor's work.
1.3. The Contractor waives any and all rights to file claims or seek compensation from Plan Aura under any workers' compensation statutes or similar laws for any injuries, illnesses, or damages arising out of or in connection with the Contractor's work.

2. Indemnification
The Contractor agrees to defend, indemnify, and hold harmless Plan Aura, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from or related to:
2.1. Any work-related injury, illness, or death sustained by the Contractor or its employees, subcontractors, or other personnel;
2.2. The Contractor's failure to obtain or maintain workers' compensation insurance coverage as required by applicable law;
2.3. Any claim, lawsuit, or demand brought by a third party related to the Contractor's work or services.

3. Contractor's Acknowledgment and Representation
The Contractor represents and warrants that:
3.1. It has read and understands the contents of this Agreement.
3.2. It has had an opportunity to consult with legal counsel regarding the implications of signing this Agreement.
3.3. It voluntarily waives its rights to workers' compensation coverage and assumes full responsibility for its own safety and the safety of its employees, subcontractors, or other personnel.

4. General Provisions
4.1. Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the State of Texas.

4.2. Severability
If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.

4.3. Entire Agreement
This Agreement constitutes the entire understanding between the Parties with respect to the subject matter herein and supersedes all prior agreements or understandings, whether written or oral.

4.4. Modification
This Agreement may only be amended or modified in writing, signed by both Parties.

4.5. Binding Effect
This Agreement shall be binding upon and inure to the benefit of the Parties and their respective successors and assigns.

5. Signatures
IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written:

Plan Aura LLC
By: _______________________________
Name: [Authorized Representative]
Title: [Title]
Date: ${currentDate}

Contractor
By: ${signature || "_______________________________"}
Name: ${signature || "[Contractor's Full Name or Authorized Representative]"}
Title: [Title]
Date: ${currentDate}`;

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