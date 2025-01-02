import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";
import { useState } from "react";
import { EntityTypeSelect, EntityType } from "./business-entity/EntityTypeSelect";
import { StateSelect } from "./business-entity/StateSelect";
import { IdentificationFields } from "./business-entity/IdentificationFields";
import { TermsAcknowledgmentModal } from "../TermsAcknowledgmentModal";
import { useForm } from "react-hook-form";

interface BusinessEntityFormProps {
  onComplete: () => void;
}

interface FormValues {
  entityType: EntityType;
  registrationState: string;
  ssn?: string;
  ein?: string;
  filingNumber?: string;
}

export function BusinessEntityForm({ onComplete }: BusinessEntityFormProps) {
  const [showTerms, setShowTerms] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      entityType: "individual",
      registrationState: "TX",
    }
  });

  const entityType = form.watch("entityType");
  const registrationState = form.watch("registrationState");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handleTermsAccept = () => {
    setShowTerms(false);
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
            <EntityTypeSelect 
              value={entityType} 
              onChange={(value) => form.setValue("entityType", value)}
              form={form}
            />
            <StateSelect 
              value={registrationState} 
              onChange={(value) => form.setValue("registrationState", value)}
              form={form}
            />
            <IdentificationFields 
              entityType={entityType} 
              registrationState={registrationState}
              form={form}
            />

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

        <TermsAcknowledgmentModal
          open={showTerms}
          onOpenChange={setShowTerms}
          onAccept={handleTermsAccept}
          isSoleProprietor={entityType === "individual"}
        />
      </CardContent>
    </Card>
  );
}