import { Card } from "@/components/ui/card";

export function ContractsDocumentation() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Contract Components Documentation</h1>
      <h2>ContractWorkflowManager</h2>
      <p>Manages the contract creation and signing workflow.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Contract creation</li>
        <li>Review process</li>
        <li>Digital signing</li>
        <li>Version tracking</li>
        <li>Workflow stages</li>
      </ul>
      <h3>State Management</h3>
      <ul>
        <li>Uses WorkflowContext for stage management</li>
        <li>Handles contract versions</li>
        <li>Manages signing status</li>
        <li>Tracks review process</li>
      </ul>
    </div>
  );
}