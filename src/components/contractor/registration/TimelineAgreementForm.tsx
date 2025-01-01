import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Shield, Clock, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractorType } from "@/types/contractor";
import { PerformanceBadge } from "../badges/PerformanceBadge";

interface TimelineAgreementFormProps {
  onComplete: () => void;
}

const contractorTypeTimelines: Record<ContractorType, string[]> = {
  electrical: [
    "Complete rough-in within 3-5 days of framing completion",
    "Install fixtures within 2-3 days of drywall completion",
    "Final inspection within 1-2 days of fixture installation"
  ],
  plumbing: [
    "Complete rough-in within 4-6 days of foundation completion",
    "Install fixtures within 2-3 days of cabinet installation",
    "Final inspection within 1-2 days of fixture installation"
  ],
  hvac: [
    "Complete rough-in within 4-5 days of framing completion",
    "Install equipment within 2-3 days of roof completion",
    "Final inspection within 1-2 days of system installation"
  ],
  roofing: [
    "Complete installation within 2-3 days of decking inspection",
    "Install flashing within 1-2 days of roofing completion",
    "Final inspection within 1 day of completion"
  ],
  foundation: [
    "Complete form setup within 2-3 days of site preparation",
    "Pour concrete within 1 day of inspection approval",
    "Allow 7 days for proper curing"
  ],
  framing: [
    "Complete wall framing within 5-7 days",
    "Complete roof framing within 3-4 days",
    "Inspection ready within 1-2 days of completion"
  ],
  drywall: [
    "Complete hanging within 3-4 days of inspection approval",
    "Complete finishing within 3-4 days of hanging",
    "Ready for paint within 1-2 days of completion"
  ],
  painting: [
    "Complete primer coat within 2-3 days of surface preparation",
    "Complete final coats within 2-3 days of primer",
    "Touch-ups within 1 day of request"
  ],
  landscaping: [
    "Complete grading within 2-3 days of construction completion",
    "Install irrigation within 2-3 days of grading",
    "Complete planting within 2-3 days of irrigation"
  ],
  general: [
    "Project planning and scheduling within 5-7 days of contract",
    "Daily oversight and coordination of all trades",
    "Final walk-through within 2-3 days of substantial completion"
  ]
};

export function TimelineAgreementForm({ onComplete }: TimelineAgreementFormProps) {
  const [agreements, setAgreements] = useState({
    authority: false,
    platformRole: false,
    timeline: false,
    compliance: false,
    dispute: false
  });

  const [contractorType, setContractorType] = useState<ContractorType>("general");

  const allAgreed = Object.values(agreements).every(value => value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allAgreed) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline & Platform Agreement
          </CardTitle>
          <CardDescription>
            Please review and acknowledge the following terms regarding project timelines and platform usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This agreement establishes your independent contractor status and relationship with Plan Aura's platform
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Your Contractor Type</Label>
                <Select 
                  value={contractorType} 
                  onValueChange={(value) => setContractorType(value as ContractorType)}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue placeholder="Select contractor type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="general">General Contractor</SelectItem>
                    <SelectItem value="electrical">Electrical Contractor</SelectItem>
                    <SelectItem value="plumbing">Plumbing Contractor</SelectItem>
                    <SelectItem value="hvac">HVAC Contractor</SelectItem>
                    <SelectItem value="roofing">Roofing Contractor</SelectItem>
                    <SelectItem value="foundation">Foundation Contractor</SelectItem>
                    <SelectItem value="framing">Framing Contractor</SelectItem>
                    <SelectItem value="drywall">Drywall Contractor</SelectItem>
                    <SelectItem value="painting">Painting Contractor</SelectItem>
                    <SelectItem value="landscaping">Landscaping Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Timeline Requirements for {contractorType.charAt(0).toUpperCase() + contractorType.slice(1)} Contractors:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {contractorTypeTimelines[contractorType].map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="authority"
                  checked={agreements.authority}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, authority: checked as boolean }))
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="authority" className="text-sm leading-tight">
                    I understand that as an Independent Contractor, I retain full authority over:
                  </Label>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>Project management decisions</li>
                    <li>Subcontractor communications</li>
                    <li>Timeline enforcement</li>
                    <li>Quality control measures</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="platformRole"
                  checked={agreements.platformRole}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, platformRole: checked as boolean }))
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="platformRole" className="text-sm leading-tight">
                    I acknowledge Plan Aura's role is limited to:
                  </Label>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>Platform facilitation</li>
                    <li>Project oversight and monitoring</li>
                    <li>Timeline tracking</li>
                    <li>Compliance verification</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Performance Recognition</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <PerformanceBadge type="expeditious" />
                <PerformanceBadge type="clientFavorite" />
                <PerformanceBadge type="precision" />
                <PerformanceBadge type="responsive" />
                <PerformanceBadge type="adaptable" />
                <PerformanceBadge type="topContractor" />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="timeline"
                  checked={agreements.timeline}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, timeline: checked as boolean }))
                  }
                />
                <div className="space-y-1">
                  <Label htmlFor="timeline" className="text-sm leading-tight">
                    I understand that my performance metrics will be publicly displayed on my contractor profile, including:
                  </Label>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>On-time completion rate</li>
                    <li>Client satisfaction ratings</li>
                    <li>Response time statistics</li>
                    <li>Quality assessment scores</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="compliance"
                  checked={agreements.compliance}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, compliance: checked as boolean }))
                  }
                />
                <Label htmlFor="compliance" className="text-sm leading-tight">
                  I agree to maintain compliance with platform requirements and understand that consistent high performance may result in earning performance badges and increased visibility on the platform
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dispute"
                  checked={agreements.dispute}
                  onCheckedChange={(checked) => 
                    setAgreements(prev => ({ ...prev, dispute: checked as boolean }))
                  }
                />
                <Label htmlFor="dispute" className="text-sm leading-tight">
                  I agree to utilize the platform's dispute resolution system for any timeline or compliance-related issues, with Plan Aura acting as a neutral facilitator
                </Label>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!allAgreed}
          >
            Accept & Complete Registration
          </Button>

          {!allAgreed && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Please review and accept all terms to complete your registration
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
