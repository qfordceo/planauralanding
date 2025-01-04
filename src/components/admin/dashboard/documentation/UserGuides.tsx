import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserGuides() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>User Guides</h1>
      
      <Tabs defaultValue="client" className="w-full">
        <TabsList>
          <TabsTrigger value="client">Client Guide</TabsTrigger>
          <TabsTrigger value="contractor">Contractor Guide</TabsTrigger>
          <TabsTrigger value="admin">Admin Guide</TabsTrigger>
          <TabsTrigger value="general">General Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="client">
          <Card className="p-6">
            <h2>Client User Guide</h2>
            <h3>Getting Started</h3>
            <ul>
              <li>Creating your account</li>
              <li>Completing your profile</li>
              <li>Understanding the pre-approval process</li>
            </ul>

            <h3>Building Your Dream Home</h3>
            <ul>
              <li>Browsing floor plans</li>
              <li>Selecting land plots</li>
              <li>Understanding build costs</li>
              <li>Customizing your build</li>
            </ul>

            <h3>Working with Contractors</h3>
            <ul>
              <li>Reviewing contractor profiles</li>
              <li>Understanding bids</li>
              <li>Contract signing process</li>
              <li>Communication best practices</li>
            </ul>

            <h3>Project Management</h3>
            <ul>
              <li>Tracking milestones</li>
              <li>Reviewing and approving work</li>
              <li>Managing documents</li>
              <li>Handling disputes</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="contractor">
          <Card className="p-6">
            <h2>Contractor Guide</h2>
            <h3>Getting Started</h3>
            <ul>
              <li>Registration process</li>
              <li>Completing compliance requirements</li>
              <li>Setting up your profile</li>
              <li>Understanding the verification process</li>
            </ul>

            <h3>Managing Your Business</h3>
            <ul>
              <li>Setting availability</li>
              <li>Managing your portfolio</li>
              <li>Tracking expenses</li>
              <li>Using the marketing tools</li>
            </ul>

            <h3>Project Management</h3>
            <ul>
              <li>Bidding on projects</li>
              <li>Contract workflow</li>
              <li>Managing timelines</li>
              <li>Updating milestones</li>
              <li>Communication tools</li>
            </ul>

            <h3>Financial Management</h3>
            <ul>
              <li>Payment milestones</li>
              <li>Invoicing process</li>
              <li>Managing escrow</li>
              <li>Tax documentation</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="p-6">
            <h2>Admin Guide</h2>
            <h3>Platform Management</h3>
            <ul>
              <li>User management</li>
              <li>Contractor verification</li>
              <li>Content moderation</li>
              <li>System monitoring</li>
            </ul>

            <h3>Compliance Management</h3>
            <ul>
              <li>Document verification</li>
              <li>Insurance tracking</li>
              <li>License verification</li>
              <li>Audit logs</li>
            </ul>

            <h3>Dispute Resolution</h3>
            <ul>
              <li>Mediation process</li>
              <li>Handling escalations</li>
              <li>Resolution documentation</li>
            </ul>

            <h3>Analytics & Reporting</h3>
            <ul>
              <li>Platform metrics</li>
              <li>Financial reports</li>
              <li>User analytics</li>
              <li>Compliance reports</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="p-6">
            <h2>General Platform Guide</h2>
            <h3>Platform Overview</h3>
            <ul>
              <li>Navigation basics</li>
              <li>Account management</li>
              <li>Security features</li>
              <li>Notification preferences</li>
            </ul>

            <h3>Communication Tools</h3>
            <ul>
              <li>Messaging system</li>
              <li>Document sharing</li>
              <li>Notification settings</li>
            </ul>

            <h3>Common Workflows</h3>
            <ul>
              <li>Document upload/download</li>
              <li>Profile management</li>
              <li>Password reset</li>
              <li>Two-factor authentication</li>
            </ul>

            <h3>Support & Help</h3>
            <ul>
              <li>Contacting support</li>
              <li>FAQs</li>
              <li>Troubleshooting</li>
              <li>Feature requests</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}