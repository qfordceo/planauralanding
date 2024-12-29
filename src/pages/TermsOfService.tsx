import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateAgreementPDF, stripHtmlTags } from "@/utils/pdfGenerator";
import { toast } from "@/components/ui/use-toast";

export default function TermsOfService() {
  const effectiveDate = "December 29, 2024";

  const handleDownload = () => {
    try {
      const contentElement = document.querySelector('.terms-content');
      if (!contentElement) throw new Error("Content not found");

      const plainText = stripHtmlTags(contentElement.innerHTML);
      const pdf = generateAgreementPDF("Terms of Service", plainText);
      pdf.save("terms-of-service.pdf");

      toast({
        title: "Success",
        description: "Terms of Service downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download Terms of Service",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Terms of Service</CardTitle>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[80vh]">
            <div className="terms-content space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Plan Aura LLC Terms of Service</h1>
                <p className="text-sm text-muted-foreground">Effective Date: {effectiveDate}</p>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>By accessing, using, or registering on Plan Aura LLC's platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and any additional agreements or policies referenced herein. If you do not agree to these Terms, you may not access or use our services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>"Plan Aura" refers to Plan Aura LLC, a Texas Limited Liability Company.</li>
                  <li>"Platform" refers to Plan Aura's website, dashboard, tools, and services.</li>
                  <li>"Client" refers to individuals or entities using the Platform to plan or manage home-building projects.</li>
                  <li>"Contractor" refers to independent professionals or businesses offering services via the Platform.</li>
                  <li>"User" collectively refers to Clients and Contractors.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Plan Aura's Role as Facilitator and Consultant</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Plan Aura primarily operates as a facilitation platform connecting Clients and Contractors.</li>
                  <li>Plan Aura may also provide advisory and consulting services for planning and scope definition.</li>
                  <li>Plan Aura does not directly manage, supervise, or guarantee the quality, timeline, or outcomes of Contractor services.</li>
                  <li>Clients and Contractors remain solely responsible for project execution, adherence to contracts, and resolution of disputes.</li>
                  <li>Plan Aura's liability is limited to the accuracy and scope of advisory services provided, and under no circumstances extends to on-site activities or contractor actions.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. User Accounts and Access</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Users must provide accurate, current, and complete information during registration.</li>
                  <li>Users are responsible for maintaining the confidentiality of their accounts and activities conducted under their accounts.</li>
                  <li>Plan Aura reserves the right to suspend or terminate accounts for violations of these Terms.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Contractor Obligations</h2>
                <p className="mb-4">Contractors must maintain current business insurance to operate on the Platform.</p>
                <p className="mb-2">Contractors must warranty their work on new construction in accordance with industry-standard new home builder warranties, including but not limited to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>1-year workmanship warranty (e.g., plumbing, electrical systems).</li>
                  <li>2-year systems warranty (e.g., HVAC, major mechanical systems).</li>
                  <li>10-year structural warranty (e.g., foundations, framing).</li>
                </ul>
                <p className="mt-4">Plan Aura reserves the right to request proof of insurance and warranties before or during the use of the Platform.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                <p className="mb-4">Plan Aura is not liable for:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Errors, omissions, or misconduct by Contractors.</li>
                  <li>Delays, cost overruns, or failures in project delivery.</li>
                  <li>Damages resulting from reliance on advisory or consulting services provided by Plan Aura.</li>
                </ul>
                <p className="mb-4"><strong>Maximum Liability Cap:</strong> Plan Aura's total liability for any claim, whether arising from contract, negligence, or other grounds, is limited to the total fees paid to Plan Aura by the Client or Contractor in the 12 months preceding the claim.</p>
                <p className="mb-4"><strong>No Consequential Damages:</strong> Plan Aura will not be liable for any indirect, incidental, consequential, or punitive damages, including loss of profits, reputation, or business opportunities.</p>
                <p><strong>Indemnification:</strong> Clients and Contractors agree to indemnify, defend, and hold harmless Plan Aura, its officers, directors, and employees from any claims, liabilities, or damages arising out of their use of the Platform, services, or advisory offerings.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Dispute Resolution</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Any disputes arising from these Terms shall be governed by the laws of the United States and the State of Texas.</li>
                  <li>Disputes must first be resolved through good faith mediation.</li>
                  <li>If mediation fails, disputes shall be resolved exclusively in the courts of Texas.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Plan Aura reserves the right to suspend or terminate access to the Platform for violation of these Terms or misuse of services.</li>
                  <li>Users may terminate their account at any time by notifying Plan Aura in writing.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Amendments</h2>
                <p>Plan Aura reserves the right to update or modify these Terms at any time. Continued use of the Platform following changes constitutes acceptance of the updated Terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Miscellaneous</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>These Terms represent the entire agreement between Users and Plan Aura.</li>
                  <li>Failure to enforce any provision of these Terms does not waive Plan Aura's rights.</li>
                  <li>If any provision is deemed invalid, the remaining provisions shall remain in full effect.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
                <p>For questions or concerns about these Terms, contact us at:</p>
                <div className="mt-2">
                  <p>Plan Aura LLC</p>
                  <p>13355 Noel Road, Suite 1100</p>
                  <p>Dallas, TX 75240</p>
                  <p>Email: legal@planaura.com</p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
