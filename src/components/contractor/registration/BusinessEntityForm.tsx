import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Info } from "lucide-react";
import { Form } from "@/components/ui/form";
import { EntityTypeSelect } from "./business-entity/EntityTypeSelect";
import { StateSelect } from "./business-entity/StateSelect";
import { IdentificationFields } from "./business-entity/IdentificationFields";
import { TermsAcknowledgmentModal } from "../TermsAcknowledgmentModal";

const formSchema = z.object({
  entityType: z.string(),
  registrationState: z.string(),
  ssn: z.string().optional(),
  ein: z.string().optional(),
  filingNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BusinessEntityFormProps {
  onComplete: () => void;
}

export function BusinessEntityForm({ onComplete }: BusinessEntityFormProps) {
  const [showTerms, setShowTerms] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entityType: "individual",
      registrationState: "TX",
    }
  });

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

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <EntityTypeSelect 
                control={form.control}
                value={form.watch("entityType")} 
                onChange={(value) => form.setValue("entityType", value)}
              />
              
              <StateSelect 
                value={form.watch("registrationState")} 
                onChange={(value) => form.setValue("registrationState", value)}
              />
              
              <IdentificationFields 
                entityType={form.watch("entityType")} 
                registrationState={form.watch("registrationState")}
                control={form.control}
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
          </Form>
        </div>

        <TermsAcknowledgmentModal
          open={showTerms}
          onOpenChange={setShowTerms}
          onAccept={handleTermsAccept}
          isSoleProprietor={form.watch("entityType") === "individual"}
        />
      </CardContent>
    </Card>
  );
}