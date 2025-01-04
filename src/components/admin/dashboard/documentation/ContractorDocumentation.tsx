import { Card } from "@/components/ui/card";

export function ContractorDocumentation() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Contractor Components Documentation</h1>
      <h2>ContractorDashboard</h2>
      <p>Main dashboard interface for contractor users.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Job management</li>
        <li>Availability scheduling</li>
        <li>Expense tracking</li>
        <li>Portfolio management</li>
        <li>Marketing tools</li>
        <li>Analytics dashboard</li>
      </ul>
      <h3>State Management</h3>
      <ul>
        <li>Uses React Query for data fetching</li>
        <li>Manages contractor profile state</li>
        <li>Handles availability updates</li>
        <li>Tracks expenses and portfolio items</li>
      </ul>
    </div>
  );
}