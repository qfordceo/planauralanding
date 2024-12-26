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
      
      // For now, return mock data since we're just demonstrating the UI
      // In a real implementation, we would use a web scraping solution
      return { 
        success: true,
        data: {
          html: `
            <div class="plan-item">
              <h3 class="plan-name">Modern Farmhouse</h3>
              <div class="bedrooms">3</div>
              <div class="bathrooms">2.5</div>
              <div class="square-feet">2,500</div>
              <div class="price">$350,000</div>
              <img src="/placeholder.svg" alt="Floor Plan" />
            </div>
            <div class="plan-item">
              <h3 class="plan-name">Ranch Style Home</h3>
              <div class="bedrooms">4</div>
              <div class="bathrooms">3</div>
              <div class="square-feet">3,000</div>
              <div class="price">$425,000</div>
              <img src="/placeholder.svg" alt="Floor Plan" />
            </div>
          `
        }
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape website' 
      };
    }
  }
}
