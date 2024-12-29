import React from "react";
import { AgreementDisplay } from "./AgreementDisplay";

export function ConsultingAgreement() {
  const content = (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Consulting Services Agreement</h2>
      
      <p>This Consulting Services Agreement ("Agreement") is entered into by and between:</p>
      <p>Plan Aura LLC, a Texas Limited Liability Company ("Consultant"), and The Client ("Client"), collectively referred to as the "Parties".</p>
      
      <div className="space-y-2">
        <h3 className="font-semibold">1. Scope of Services</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Plan Aura will provide project planning, advisory services, and consultation related to home-building projects.</li>
          <li>Services are limited to planning and advisory capacities and do not extend to managing or supervising construction activities.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">2. Fees and Payment</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>The Client agrees to pay fees as detailed in an attached Statement of Work (SOW).</li>
          <li>Payment terms will be specified in the SOW.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">3. Client Responsibilities</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide accurate project details and specifications.</li>
          <li>Cooperate with Plan Aura to ensure effective communication and timely decisions.</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">4. Independent Contractor Status</h3>
        <p>Plan Aura is an independent consultant and not an employee or partner of the Client.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">5. Limitation of Liability</h3>
        <p>Plan Aura’s liability is limited to the fees paid under this agreement.</p>
        <p>Plan Aura is not liable for outcomes of contractor work or third-party services.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">6. Confidentiality</h3>
        <p>Both parties agree to maintain the confidentiality of proprietary information exchanged during the engagement.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">7. Governing Law</h3>
        <p>This Agreement is governed by the laws of the State of Texas.</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">8. Dispute Resolution</h3>
        <p>Any disputes will be resolved through mediation before legal action is taken.</p>
      </div>
    </div>
  );

  const handleDownload = () => {
    // TODO: Implement PDF download functionality
    console.log("Downloading consulting agreement...");
  };

  return (
    <AgreementDisplay
      title="Consulting Services Agreement"
      content={content}
      onDownload={handleDownload}
    />
  );
}
