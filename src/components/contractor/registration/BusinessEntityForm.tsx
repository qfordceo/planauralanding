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
  const [registrationState, setRegistrationState] = useState<string>("TX");
  
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

  const states = [
    { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
    { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" }
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
              Your business can be registered in any state, but must be authorized to operate in Texas. 
              If registered outside of Texas, you may need to file as a foreign entity with the Texas Secretary of State.
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
              <Label htmlFor="registrationState">State of Registration</Label>
              <Select 
                onValueChange={setRegistrationState} 
                defaultValue={registrationState}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Select state of registration" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
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
                  {registrationState === "TX" 
                    ? (entityType === "llc" ? "Texas LLC Filing Number" : "Texas Filing Number")
                    : `${states.find(s => s.value === registrationState)?.label} Filing Number`}
                </Label>
                <Input 
                  id="filingNumber" 
                  placeholder="Enter your filing number" 
                  required 
                />
                <p className="text-sm text-muted-foreground">
                  {registrationState === "TX" 
                    ? "This is the number assigned by the Texas Secretary of State when your entity was formed"
                    : `This is your entity's filing number from the ${states.find(s => s.value === registrationState)?.label} Secretary of State`}
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