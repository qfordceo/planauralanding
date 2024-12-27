import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bid } from "./types";

interface BidNotificationItemProps {
  bid: Bid;
}

export function BidNotificationItem({ bid }: BidNotificationItemProps) {
  return (
    <Alert key={bid.id} variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Outbid on Project: {bid.project_title}</AlertTitle>
      <AlertDescription>
        Your bid of ${bid.bid_amount.toLocaleString()} has been outbid. Consider submitting a new bid to stay competitive.
      </AlertDescription>
    </Alert>
  );
}