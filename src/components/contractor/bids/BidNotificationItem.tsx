import { Button } from "@/components/ui/button";
import { useContractorNotifications } from "@/hooks/use-contractor-notifications";
import { useToast } from "@/hooks/use-toast";
import { Bid } from "./types";

interface BidNotificationItemProps {
  bid: Bid;
}

export function BidNotificationItem({ bid }: BidNotificationItemProps) {
  const { notifyNewBid } = useContractorNotifications(bid.contractor_id);
  const { toast } = useToast();

  const handleResendNotification = async () => {
    try {
      await notifyNewBid(bid.project_title);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend notification",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{bid.project_title}</h3>
        <span className="text-sm text-muted-foreground">
          ${bid.bid_amount.toLocaleString()}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">
        Your bid has been outbid. Consider submitting a new bid to stay competitive.
      </p>
      <Button variant="outline" size="sm" onClick={handleResendNotification}>
        Resend Notification
      </Button>
    </div>
  );
}