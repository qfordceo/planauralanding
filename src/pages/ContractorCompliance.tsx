import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContractorCompliance() {
  const complianceItems = [
    {
      title: "Business Entity",
      status: "complete",
      description: "LLC registration complete"
    },
    {
      title: "Worker's Compensation",
      status: "pending",
      description: "Coverage verification needed"
    },
    {
      title: "BBB Accreditation",
      status: "pending",
      description: "Accreditation pending review"
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Compliance Status</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {complianceItems.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{item.title}</CardTitle>
                {item.status === "complete" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.description}</p>
              {item.status === "pending" && (
                <Button className="w-full mt-4">
                  Complete Verification
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}