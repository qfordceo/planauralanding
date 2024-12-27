import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BidNotificationItem } from "./bids/BidNotificationItem";
import { useBidNotifications } from "./bids/useBidNotifications";
import type { BidNotificationsProps } from "./bids/types";

export function BidNotifications({ contractorId }: BidNotificationsProps) {
  const { data: outbidBids, isLoading, error } = useBidNotifications(contractorId);

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading notifications...</div>;
  }

  if (error) {
    console.error('Query error:', error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load bid notifications. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {outbidBids?.map((bid) => (
        <BidNotificationItem key={bid.id} bid={bid} />
      ))}
      {!outbidBids?.length && (
        <p className="text-center text-muted-foreground">
          No active bid notifications.
        </p>
      )}
    </div>
  );
}