import React from "react";
import { AgreementDisplay } from "./AgreementDisplay";
import { generateAgreementPDF, stripHtmlTags } from "@/utils/pdfGenerator";
import { toast } from "@/components/ui/use-toast";

export function LiabilityWaiver() {
  const content = (
    <div className="space-y-4">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold">Client Liability Waiver</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Version: 1.0</p>
          <p>Last Updated: December 29, 2024</p>
          <p className="italic">This agreement is subject to updates. Please check regularly for the latest version.</p>
        </div>
      </div>
      
      <p>This Liability Waiver ("Waiver") is entered into by:</p>
      <p>Plan Aura LLC, and The Client ("Client").</p>
      
      <div className="space-y-2">
        <h3 className="font-semibold">1. Acknowledgment of Risk</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Client acknowledges that Plan Aura acts solely as a facilitator and advisor and does not perform construction work.</li>
          <li>The Client agrees to assume all risks associated with contractor performance and construction projects.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">2. Release of Liability</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Client releases Plan Aura LLC, its employees, and affiliates from any liability, claims, or damages arising from contractor performance or third-party services.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">3. Indemnification</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Client agrees to indemnify Plan Aura against any claims resulting from contractor activities.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">4. Governing Law</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>This Waiver is governed by the laws of the State of Texas.</li>
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
      const pdf = generateAgreementPDF("Client Liability Waiver", plainText);
      pdf.save("liability-waiver.pdf");

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
      title="Client Liability Waiver"
      content={content}
      onDownload={handleDownload}
    />
  );
}
