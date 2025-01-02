import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";

interface BusinessEntityFormProps {
  onComplete: () => void;
}

export function BusinessEntityForm({ onComplete }: BusinessEntityFormProps) {
  const [entityType, setEntityType] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  const entityTypes = [
    { value: "individual", label: "Individual/Sole Proprietorship" },
    { value: "llc", label: "Limited Liability Company (LLC)" },
    { value: "corporation", label: "Corporation" },
    { value: "partnership", label: "Partnership" },
    { value: "lp", label: "Limited Partnership" },
    { value: "llp", label: "Limited Liability Partnership" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Entity Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your business must be registered as a legal entity in Texas. For LLCs and Corporations, 
              you'll need your filing number from the Texas Secretary of State.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entityType">Entity Type</Label>
              <Select 
                onValueChange={setEntityType} 
                defaultValue={entityType}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select your business entity type" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  {entityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ein">EIN Number</Label>
              <Input 
                id="ein" 
                placeholder="XX-XXXXXXX" 
                required={entityType !== "individual"}
              />
              {entityType === "individual" && (
                <p className="text-sm text-muted-foreground">
                  Optional for individual contractors. You may use your SSN for tax purposes.
                </p>
              )}
            </div>
            
            {entityType && entityType !== "individual" && (
              <div className="space-y-2">
                <Label htmlFor="filingNumber">
                  {entityType === "llc" ? "Texas LLC Filing Number" : "Texas Filing Number"}
                </Label>
                <Input 
                  id="filingNumber" 
                  placeholder="Enter your filing number" 
                  required 
                />
                <p className="text-sm text-muted-foreground">
                  This is the number assigned by the Texas Secretary of State when your entity was formed
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="formation">Formation/Registration Date</Label>
              <Input 
                id="formation" 
                type="date" 
                required
              />
            </div>

            <div className="flex flex-col space-y-4">
              <Button asChild variant="outline">
                <a 
                  href="https://www.sos.state.tx.us/corp/forms_boc.shtml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Texas Secretary of State
                </a>
              </Button>
              <Button type="submit">Continue</Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}