import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EntityType } from "./EntityTypeSelect";
import { states } from "./StateSelect";

interface IdentificationFieldsProps {
  entityType: EntityType;
  registrationState: string;
}

export function IdentificationFields({ entityType, registrationState }: IdentificationFieldsProps) {
  const isIndividual = entityType === "individual";
  const stateName = states.find(s => s.value === registrationState)?.label;
  const showEINField = !isIndividual || entityType === "individual";

  return (
    <div className="space-y-4">
      {isIndividual && (
        <div className="space-y-2">
          <Label htmlFor="ssn" className="flex items-center gap-2">
            Social Security Number
            <span className="text-sm text-muted-foreground">(Required for sole proprietors)</span>
          </Label>
          <Input 
            id="ssn"
            type="password"
            placeholder="XXX-XX-XXXX"
            required={isIndividual}
          />
          <p className="text-sm text-muted-foreground">
            Your SSN is required for tax purposes and verification. We recommend obtaining an EIN for enhanced privacy.
          </p>
          <Button asChild variant="outline" className="w-full mt-2">
            <a 
              href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Apply for an EIN (Free via IRS)
            </a>
          </Button>
        </div>
      )}
      
      {showEINField && (
        <div className="space-y-2">
          <Label htmlFor="ein" className="flex items-center gap-2">
            EIN Number
            {isIndividual && <span className="text-sm text-muted-foreground">(Recommended)</span>}
          </Label>
          <Input 
            id="ein"
            placeholder="XX-XXXXXXX"
            required={!isIndividual}
          />
          {isIndividual && (
            <p className="text-sm text-muted-foreground">
              While not required for sole proprietors, an EIN provides better privacy and professionalism.
            </p>
          )}
        </div>
      )}
      
      {!isIndividual && (
        <div className="space-y-2">
          <Label htmlFor="filingNumber">
            {registrationState === "TX" 
              ? `Texas ${entityType.toUpperCase()} Filing Number`
              : `${stateName} Filing Number`}
          </Label>
          <Input 
            id="filingNumber" 
            placeholder="Enter your filing number" 
            required 
          />
          <p className="text-sm text-muted-foreground">
            {registrationState === "TX" 
              ? "This is the number assigned by the Texas Secretary of State when your entity was formed"
              : `This is your entity's filing number from the ${stateName} Secretary of State`}
          </p>
        </div>
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