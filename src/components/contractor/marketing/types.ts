export interface MarketingContent {
  id: string;
  title: string;
  content: string;
  type: string;
  status: string;
  scheduled_date?: string;
  platform?: string;
  metrics?: {
    views?: number;
    clicks?: number;
    conversions?: number;
  };
}