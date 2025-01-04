import { Card } from "@/components/ui/card";

export function ProjectsDocumentation() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Project Components Documentation</h1>
      <h2>ProjectList</h2>
      <p>Displays and manages all projects.</p>
      <h3>Key Features</h3>
      <ul>
        <li>Project listing</li>
        <li>Creation interface</li>
        <li>Detail view</li>
        <li>Task management</li>
        <li>Timeline tracking</li>
      </ul>
      <h3>State Management</h3>
      <ul>
        <li>Uses React Query for project data</li>
        <li>Manages project selection</li>
        <li>Handles task updates</li>
        <li>Tracks project status</li>
      </ul>
    </div>
  );
}