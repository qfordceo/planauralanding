import React from "react";
import { AgreementDisplay } from "./AgreementDisplay";
import { generateAgreementPDF, stripHtmlTags } from "@/utils/pdfGenerator";
import { toast } from "@/components/ui/use-toast";

export function ContractorAgreement() {
  const content = (
    <div className="space-y-4">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold">Independent Contractor Agreement</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Version: 1.0</p>
          <p>Last Updated: December 29, 2024</p>
          <p className="italic">This agreement is subject to updates. Please check regularly for the latest version.</p>
        </div>
      </div>
      
      <p>This Independent Contractor Agreement ("Agreement") is entered into by and between:</p>
      <p>Plan Aura LLC ("Company"), and The Contractor ("Contractor"), collectively referred to as the "Parties".</p>
      
      <div className="space-y-2">
        <h3 className="font-semibold">1. Services Provided</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contractor agrees to provide services as specified in individual project scopes.</li>
          <li>Contractor maintains full control and responsibility for their work.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">2. Independent Status</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contractor is an independent contractor and not an employee of Plan Aura.</li>
          <li>Contractor will be responsible for taxes, insurance, and compliance with local laws.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">3. Insurance Requirements</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contractor must maintain general liability insurance and provide proof upon request.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">4. Warranties</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contractor agrees to warranty their work according to standard new home builder warranties:</li>
          <ul className="list-disc pl-6 space-y-1">
            <li>1-year workmanship warranty</li>
            <li>2-year systems warranty</li>
            <li>10-year structural warranty</li>
          </ul>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">5. Limitation of Liability</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Plan Aura assumes no liability for Contractor's performance or project outcomes.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">6. Indemnification</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contractor agrees to indemnify and hold harmless Plan Aura from any legal claims arising from their work.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">7. Governing Law</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>This Agreement is governed by the laws of the State of Texas.</li>
        </ul>
      </div>
    </div>
  );

  const handleDownload = () => {
    try {
      const contentElement = document.createElement('div');
      contentElement.innerHTML = content.props.children
        .map((child: React.ReactElement) => {
          if (typeof child === 'string') return child;
          return child.props.children;
        })
        .join('\n\n');

      const plainText = stripHtmlTags(contentElement.innerHTML);
      const pdf = generateAgreementPDF("Independent Contractor Agreement", plainText);
      pdf.save("contractor-agreement.pdf");

      toast({
        title: "Success",
        description: "Agreement downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download agreement",
        variant: "destructive",
      });
    }
  };

  return (
    <AgreementDisplay
      title="Independent Contractor Agreement"
      content={content}
      onDownload={handleDownload}
    />
  );
}
