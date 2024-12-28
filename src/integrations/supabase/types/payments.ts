export interface ContractorPayment {
  id: string;
  contractor_id: string;
  project_id: string;
  amount: number;
  platform_fee: number;
  processing_fee: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  stripe_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractorPaymentSettings {
  id: string;
  contractor_id: string;
  stripe_connect_id: string | null;
  payment_type: 'individual' | 'organization';
  tax_id_type: string | null;
  tax_id: string | null;
  created_at: string;
  updated_at: string;
}