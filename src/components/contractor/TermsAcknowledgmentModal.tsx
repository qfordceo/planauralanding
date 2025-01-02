import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface TermsAcknowledgmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  isSoleProprietor?: boolean;
}

export function TermsAcknowledgmentModal({
  open,
  onOpenChange,
  onAccept,
  isSoleProprietor = false,
}: TermsAcknowledgmentModalProps) {
  const [insuranceAcknowledged, setInsuranceAcknowledged] = useState(false);
  const [warrantyAcknowledged, setWarrantyAcknowledged] = useState(false);
  const [liabilityAcknowledged, setLiabilityAcknowledged] = useState(false);
  const currentDate = format(new Date(), "MMMM d, yyyy");

  const handleAccept = () => {
    if (insuranceAcknowledged && warrantyAcknowledged && (!isSoleProprietor || liabilityAcknowledged)) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms Acknowledgment</DialogTitle>
          <DialogDescription>
            Please review and acknowledge the following requirements before proceeding
          </DialogDescription>
        </DialogHeader>

        {isSoleProprietor && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              As a sole proprietor, you are personally liable for all business obligations and risks.
              We strongly recommend forming an LLC or corporation to protect your personal assets.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="insurance"
              checked={insuranceAcknowledged}
              onCheckedChange={(checked) => setInsuranceAcknowledged(checked as boolean)}
            />
            <Label htmlFor="insurance" className="text-sm leading-tight">
              I understand that I must maintain current business insurance to operate on the Platform,
              including general liability insurance with minimum coverage of $1,000,000 per occurrence
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="warranty"
              checked={warrantyAcknowledged}
              onCheckedChange={(checked) => setWarrantyAcknowledged(checked as boolean)}
            />
            <Label htmlFor="warranty" className="text-sm leading-tight">
              I understand and agree to provide industry-standard warranties for all work, including:
              <ul className="list-disc pl-5 mt-2">
                <li>1-year workmanship warranty</li>
                <li>2-year systems warranty</li>
                <li>10-year structural warranty</li>
              </ul>
            </Label>
          </div>

          {isSoleProprietor && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="liability"
                checked={liabilityAcknowledged}
                onCheckedChange={(checked) => setLiabilityAcknowledged(checked as boolean)}
              />
              <Label htmlFor="liability" className="text-sm leading-tight">
                I acknowledge and agree that as a sole proprietor:
                <ul className="list-disc pl-5 mt-2">
                  <li>I am personally responsible for all business obligations and liabilities</li>
                  <li>I release Plan Aura from any responsibility for injuries, damages, or disputes arising from my work</li>
                  <li>I will indemnify and hold Plan Aura harmless from any claims related to my work</li>
                  <li>This waiver is effective as of {currentDate}</li>
                </ul>
              </Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={!insuranceAcknowledged || !warrantyAcknowledged || (isSoleProprietor && !liabilityAcknowledged)}
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}