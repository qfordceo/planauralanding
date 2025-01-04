import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ContractTerms() {
  return (
    <Accordion type="single" collapsible className="w-full mb-6">
      <AccordionItem value="terms">
        <AccordionTrigger>Important Terms & Conditions</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              By signing this contract, you acknowledge and agree to the following
              terms:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Timeline and milestone commitments</li>
              <li>Payment schedule and terms</li>
              <li>Change order procedures</li>
              <li>Dispute resolution process</li>
              <li>Warranty and liability terms</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}