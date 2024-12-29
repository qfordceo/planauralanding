import React from "react";
import { AgreementDisplay } from "./AgreementDisplay";

export function LiabilityWaiver() {
  const content = (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Client Liability Waiver</h2>
      
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
    // TODO: Implement PDF download functionality
    console.log("Downloading liability waiver...");
  };

  return (
    <AgreementDisplay
      title="Client Liability Waiver"
      content={content}
      onDownload={handleDownload}
    />
  );
}