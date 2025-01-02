import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shield } from "lucide-react";

export default function ContractorResourceHub() {
  const resources = [
    {
      title: "Form an LLC",
      description: "Guide to forming an LLC in Texas",
      link: "https://www.sos.state.tx.us/corp/forms_boc.shtml",
      cost: "$300 via Texas Secretary of State"
    },
    {
      title: "Get an EIN",
      description: "Apply for an Employer Identification Number",
      link: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
      cost: "Free via IRS website"
    },
    {
      title: "BBB Accreditation",
      description: "Steps to become BBB Accredited",
      link: "https://www.bbb.org/get-accredited",
      cost: "Varies by region and revenue"
    },
    {
      title: "Workers' Compensation Insurance",
      description: "Information about workers' compensation coverage in Texas",
      link: "https://www.tdi.texas.gov/wc/index.html",
      cost: "Varies by coverage and provider",
      icon: Shield
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Contractor Resource Hub</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{resource.description}</p>
              <p className="text-sm mb-4">Cost: {resource.cost}</p>
              <Button asChild variant="outline" className="w-full">
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2"
                >
                  View Resource <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}