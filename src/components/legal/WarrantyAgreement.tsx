import React from "react";
import { AgreementDisplay } from "./AgreementDisplay";
import { generateAgreementPDF, stripHtmlTags } from "@/utils/pdfGenerator";
import { toast } from "@/components/ui/use-toast";

export function WarrantyAgreement() {
  const content = (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contractor Warranty and Insurance Acknowledgment Agreement</h2>
      
      <p>This Acknowledgment Agreement ("Agreement") is entered into by and between:</p>
      <p>Plan Aura LLC, and The Contractor.</p>
      
      <div className="space-y-2">
        <h3 className="font-semibold">1. Insurance Requirements</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contractor agrees to maintain active general liability insurance throughout their use of the Platform.</li>
          <li>Contractor will provide proof of insurance upon request.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">2. Warranty Requirements</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>1-year workmanship warranty</li>
          <li>2-year systems warranty</li>
          <li>10-year structural warranty</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">3. Acknowledgment of Platform Terms</h3>
        <p>Contractor acknowledges that Plan Aura is not responsible for their work or liabilities incurred through their services. Failure to meet these requirements may result in removal from the Platform.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">4. Governing Law</h3>
        <p>This Agreement is governed by the laws of the State of Texas.</p>
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
      const pdf = generateAgreementPDF("Contractor Warranty and Insurance Agreement", plainText);
      pdf.save("warranty-agreement.pdf");

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
      title="Warranty and Insurance Agreement"
      content={content}
      onDownload={handleDownload}
    />
  );
}