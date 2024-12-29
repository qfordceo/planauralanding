export interface Bid {
  id: string;
  project_id: string;
  contractor_id: string;  // Added this field
  bid_amount: number;
  outbid: boolean;
  project_title?: string;
}

export interface BidNotificationsProps {
  contractorId: string;
}