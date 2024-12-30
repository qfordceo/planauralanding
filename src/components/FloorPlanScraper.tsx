import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FloorPlanAnalyzer } from './floor-plans/FloorPlanAnalyzer';

interface FloorPlan {
  name: string;
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  price?: string;
  imageUrl?: string;
}

export const FloorPlanScraper = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('https://www.floorplans.com/house-plans/');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    
    try {
      console.log('Starting floor plans scrape for URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      if (result.success && result.data) {
        // Parse the scraped HTML to extract floor plan information
        const parsedData = parseFloorPlansData(result.data);
        setFloorPlans(parsedData);
        
        toast({
          title: "Success",
          description: `Found ${parsedData.length} floor plans`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to scrape floor plans",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error scraping floor plans:', error);
      toast({
        title: "Error",
        description: "Failed to scrape floor plans",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const parseFloorPlansData = (data: any): FloorPlan[] => {
    // This is a basic example - adjust selectors based on the actual website structure
    try {
      const plans: FloorPlan[] = [];
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.html, 'text/html');
      
      // Example selectors - adjust these based on the actual website structure
      const planElements = doc.querySelectorAll('.plan-item');
      
      planElements.forEach(element => {
        const plan: FloorPlan = {
          name: element.querySelector('.plan-name')?.textContent?.trim() || 'Unnamed Plan',
          bedrooms: element.querySelector('.bedrooms')?.textContent?.trim(),
          bathrooms: element.querySelector('.bathrooms')?.textContent?.trim(),
          squareFeet: element.querySelector('.square-feet')?.textContent?.trim(),
          price: element.querySelector('.price')?.textContent?.trim(),
          imageUrl: element.querySelector('img')?.getAttribute('src') || undefined
        };
        plans.push(plan);
      });
      
      return plans;
    } catch (error) {
      console.error('Error parsing floor plans data:', error);
      return [];
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Floor Plans URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            placeholder="https://www.floorplans.com/house-plans/"
            required
          />
        </div>
        {isLoading && (
          <Progress value={progress} className="w-full" />
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Scraping..." : "Find Floor Plans"}
        </Button>
      </form>

      {floorPlans.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {floorPlans.map((plan, index) => (
              <Card key={index} className="overflow-hidden">
                {plan.imageUrl && (
                  <img 
                    src={plan.imageUrl} 
                    alt={plan.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    {plan.bedrooms && (
                      <div className="flex justify-between">
                        <dt>Bedrooms:</dt>
                        <dd>{plan.bedrooms}</dd>
                      </div>
                    )}
                    {plan.bathrooms && (
                      <div className="flex justify-between">
                        <dt>Bathrooms:</dt>
                        <dd>{plan.bathrooms}</dd>
                      </div>
                    )}
                    {plan.squareFeet && (
                      <div className="flex justify-between">
                        <dt>Square Feet:</dt>
                        <dd>{plan.squareFeet}</dd>
                      </div>
                    )}
                    {plan.price && (
                      <div className="flex justify-between">
                        <dt>Price:</dt>
                        <dd>{plan.price}</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>

          <FloorPlanAnalyzer />
        </>
      )}
    </div>
  );
};