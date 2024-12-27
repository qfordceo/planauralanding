export interface Bid {
  id: string;
  project_id: string;
  bid_amount: number;
  outbid: boolean;
  project_title?: string;
}

export interface BidNotificationsProps {
  contractorId: string;
}