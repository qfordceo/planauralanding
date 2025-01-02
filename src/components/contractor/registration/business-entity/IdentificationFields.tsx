import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import type { EntityType } from "./EntityTypeSelect";
import { states } from "./StateSelect";
import { SSNField } from "./SSNField";
import { EINField } from "./EINField";
import { FilingNumberField } from "./FilingNumberField";

interface IdentificationFieldsProps {
  entityType: EntityType;
  registrationState: string;
  form: UseFormReturn<any>;
}

export function IdentificationFields({ 
  entityType, 
  registrationState, 
  form 
}: IdentificationFieldsProps) {
  const isIndividual = entityType === "individual";
  const stateName = states.find(s => s.value === registrationState)?.label;
  const showEINField = !isIndividual || entityType === "individual";

  return (
    <div className="space-y-4">
      {isIndividual && <SSNField form={form} required={isIndividual} />}
      
      {showEINField && (
        <EINField 
          form={form} 
          required={!isIndividual} 
          showHelperText={isIndividual} 
        />
      )}
      
      {!isIndividual && stateName && (
        <FilingNumberField 
          form={form} 
          stateName={stateName} 
          stateCode={registrationState} 
        />
      )}

      {isIndividual && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Consider forming an LLC for better liability protection. Cost is $300 via the Texas Secretary of State.
            <Button asChild variant="link" className="p-0 h-auto mt-2">
              <a 
                href="https://www.sos.state.tx.us/corp/forms_boc.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Learn more about forming an LLC
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}