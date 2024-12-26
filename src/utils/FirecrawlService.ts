import { supabase } from "@/integrations/supabase/client";

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any;
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      console.log('Starting floor plans scrape for URL:', url);
      
      const { data, error } = await supabase.functions.invoke('scrape-floor-plans', {
        body: { url }
      });

      if (error) {
        console.error('Error during scrape:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to scrape website' 
        };
      }

      console.log('Scrape successful:', data);
      return { 
        success: true,
        data
      };
    } catch (error) {
      console.error('Error during scrape:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape website' 
      };
    }
  }
}