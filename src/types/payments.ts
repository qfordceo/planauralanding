export interface PaymentMilestone {
  id: string;
  contractor_id: string;
  project_id: string;
  title: string;
  amount: number;
  due_date: string | null;
  completed_date: string | null;
  status: 'pending' | 'completed';
  description?: string;
  invoice_generated: boolean;
  invoice_url: string | null;
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  escrow_status: 'pending' | 'funded' | 'released' | 'disputed' | 'refunded';
  escrow_funded_at: string | null;
  escrow_released_at: string | null;
  dispute_reason: string | null;
  dispute_resolution_notes: string | null;
  release_conditions: string[];
  created_at: string;
  updated_at: string;
}

export interface MilestoneFormData {
  title: string;
  amount: string;
  due_date: string;
  description: string;
  release_conditions?: string[];
}