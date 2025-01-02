import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EntityType } from "./EntityTypeSelect";

interface IdentificationFieldsProps {
  entityType: EntityType;
  registrationState: string;
}

export function IdentificationFields({ entityType, registrationState }: IdentificationFieldsProps) {
  const isIndividual = entityType === "individual";
  const stateName = states.find(s => s.value === registrationState)?.label;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={isIndividual ? "ssn" : "ein"}>
          {isIndividual ? "Social Security Number" : "EIN Number"}
        </Label>
        <Input 
          id={isIndividual ? "ssn" : "ein"}
          placeholder={isIndividual ? "XXX-XX-XXXX" : "XX-XXXXXXX"} 
          required={true}
        />
        {isIndividual && (
          <p className="text-sm text-muted-foreground">
            Your SSN is required for tax purposes and verification.
          </p>
        )}
      </div>
      
      {!isIndividual && (
        <div className="space-y-2">
          <Label htmlFor="filingNumber">
            {registrationState === "TX" 
              ? (entityType === "llc" ? "Texas LLC Filing Number" : "Texas Filing Number")
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
    </>
  );
}