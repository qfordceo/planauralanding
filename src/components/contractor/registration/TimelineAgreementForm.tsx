import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Shield, Clock, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TimelineAgreementFormProps {
  onComplete: () => void;
}

export function TimelineAgreementForm({ onComplete }: TimelineAgreementFormProps) {
  const [agreements, setAgreements] = useState({
    authority: false,
    platformRole: false,
    timeline: false,
    compliance: false,
    dispute: false
  });

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
          {/* Authority & Independence Section */}
          <div className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This agreement establishes your independent contractor status and relationship with Plan Aura's platform
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
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
                    I understand that as a General Contractor, I retain full authority over:
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

            {/* Performance & Incentives Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Performance Recognition</h3>
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
                  I agree to maintain compliance with platform requirements and understand that consistent high performance may result in "Preferred Contractor" status and increased visibility on the platform
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