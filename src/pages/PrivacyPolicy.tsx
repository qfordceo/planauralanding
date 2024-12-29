import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateAgreementPDF, stripHtmlTags } from "@/utils/pdfGenerator";
import { toast } from "@/components/ui/use-toast";

export default function PrivacyPolicy() {
  const lastUpdated = "December 29, 2024";

  const handleDownload = () => {
    try {
      const contentElement = document.querySelector('.privacy-policy-content');
      if (!contentElement) throw new Error("Content not found");

      const plainText = stripHtmlTags(contentElement.innerHTML);
      const pdf = generateAgreementPDF("Privacy Policy", plainText);
      pdf.save("privacy-policy.pdf");

      toast({
        title: "Success",
        description: "Privacy Policy downloaded successfully",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to download Privacy Policy",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Privacy Policy</CardTitle>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[80vh]">
            <div className="privacy-policy-content space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p>Welcome to PlanAura ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
                <h3 className="text-xl font-medium mb-2">2.1 Client Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact information (name, email, phone number)</li>
                  <li>Address and location data</li>
                  <li>Project preferences and requirements</li>
                  <li>Financial information for payment processing</li>
                </ul>

                <h3 className="text-xl font-medium mb-2 mt-4">2.2 Contractor Data</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Business information</li>
                  <li>Licensing and certification details</li>
                  <li>Insurance information</li>
                  <li>Portfolio and work history</li>
                </ul>

                <h3 className="text-xl font-medium mb-2 mt-4">2.3 Automatic Data Collection</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP addresses</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Usage patterns and analytics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
                <p>We use collected data to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Facilitate matches between clients and contractors</li>
                  <li>Process payments and transactions</li>
                  <li>Improve our services and user experience</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Communicate important updates and information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service providers (payment processors, cloud storage)</li>
                  <li>Professional advisers (lawyers, accountants)</li>
                  <li>Law enforcement when required by law</li>
                </ul>
                <p className="mt-4 font-medium">We do not sell or rent your personal information to third parties.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p>We implement appropriate security measures including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data backup procedures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p>Under CCPA and other applicable laws, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
                <p>Our services are not intended for children under 13 years of age. We do not knowingly collect or maintain information from children under 13.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Updates to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p>For privacy-related inquiries, please contact us at:</p>
                <div className="mt-2">
                  <p>PlanAura</p>
                  <p>13355 Noel Road, Suite 1100</p>
                  <p>Dallas, TX 75240</p>
                  <p>Email: privacy@planaura.com</p>
                </div>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
