import { Card } from "@/components/ui/card";

export function ClientDocumentation() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Client Components Documentation</h1>
      <h2>ClientDashboard</h2>
      <p>The main dashboard component for client users.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Project timeline visualization</li>
        <li>Document repository</li>
        <li>Communication hub</li>
        <li>Build cost tracking</li>
        <li>Materials management</li>
        <li>Saved floor plans and land plots</li>
      </ul>
      <h3>State Management</h3>
      <ul>
        <li>Uses React Query for data fetching</li>
        <li>Manages active project state</li>
        <li>Handles document uploads and updates</li>
      </ul>
    </div>
  );
}