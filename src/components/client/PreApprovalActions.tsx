import { FC } from "react";
import { Button } from "@/components/ui/button";
import { PreApprovalStatus } from "@/types/profile";

interface PreApprovalActionsProps {
  status: PreApprovalStatus | null;
  onStartPreApproval: () => void;
  onSetCashBuyer: () => void;
}

export const PreApprovalActions: FC<PreApprovalActionsProps> = ({
  status,
  onStartPreApproval,
  onSetCashBuyer
}) => {
  if (status === 'approved' || status === 'cash') return null;

  return (
    <div className="space-y-4">
      <Button onClick={onStartPreApproval} className="w-full">
        Start {status === 'rejected' ? 'New ' : ''}Pre-Approval
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button 
        onClick={onSetCashBuyer} 
        variant="outline"
        className="w-full"
      >
        I'm a Cash Buyer
      </Button>
    </div>
  );
};