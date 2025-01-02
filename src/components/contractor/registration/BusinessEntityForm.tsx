import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { EntityTypeSelect, EntityType } from "./business-entity/EntityTypeSelect";
import { StateSelect } from "./business-entity/StateSelect";
import { IdentificationFields } from "./business-entity/IdentificationFields";

interface BusinessEntityFormProps {
  onComplete: () => void;
}

export function BusinessEntityForm({ onComplete }: BusinessEntityFormProps) {
  const [entityType, setEntityType] = useState<EntityType>("individual");
  const [registrationState, setRegistrationState] = useState<string>("TX");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

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
            <EntityTypeSelect value={entityType} onChange={setEntityType} />
            <StateSelect value={registrationState} onChange={setRegistrationState} />
            <IdentificationFields entityType={entityType} registrationState={registrationState} />

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