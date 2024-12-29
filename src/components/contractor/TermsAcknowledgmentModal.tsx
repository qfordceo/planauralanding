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
import { useState } from "react";

interface TermsAcknowledgmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export function TermsAcknowledgmentModal({
  open,
  onOpenChange,
  onAccept,
}: TermsAcknowledgmentModalProps) {
  const [insuranceAcknowledged, setInsuranceAcknowledged] = useState(false);
  const [warrantyAcknowledged, setWarrantyAcknowledged] = useState(false);

  const handleAccept = () => {
    if (insuranceAcknowledged && warrantyAcknowledged) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Terms Acknowledgment</DialogTitle>
          <DialogDescription>
            Please acknowledge the following requirements before proceeding
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="insurance"
              checked={insuranceAcknowledged}
              onCheckedChange={(checked) => setInsuranceAcknowledged(checked as boolean)}
            />
            <Label htmlFor="insurance" className="text-sm leading-tight">
              I understand that I must maintain current business insurance to operate on the Platform
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
        </div>
        <DialogFooter>
          <Button
            onClick={handleAccept}
            disabled={!insuranceAcknowledged || !warrantyAcknowledged}
          >
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}