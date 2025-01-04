import { Card } from "@/components/ui/card";

export function ApiDocumentation() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>API Documentation</h1>
      
      <h2>Authentication</h2>
      <p>All API endpoints require authentication using Supabase JWT tokens.</p>
      
      <h3>Edge Functions</h3>
      <ul>
        <li>
          <h4>analyze-floor-plan</h4>
          <p>Analyzes uploaded floor plans using AI to extract key features.</p>
          <pre><code>POST /functions/v1/analyze-floor-plan</code></pre>
        </li>
        <li>
          <h4>contractor-advisor</h4>
          <p>Provides AI-powered recommendations for contractors.</p>
          <pre><code>POST /functions/v1/contractor-advisor</code></pre>
        </li>
        <li>
          <h4>suggest-materials</h4>
          <p>Generates material suggestions based on floor plan analysis.</p>
          <pre><code>POST /functions/v1/suggest-materials</code></pre>
        </li>
      </ul>

      <h3>Database API</h3>
      <ul>
        <li>
          <h4>Floor Plans</h4>
          <p>Manage floor plan data and related analyses.</p>
          <pre><code>GET /rest/v1/floor_plans</code></pre>
          <pre><code>POST /rest/v1/floor_plans</code></pre>
        </li>
        <li>
          <h4>Contractors</h4>
          <p>Manage contractor profiles and availability.</p>
          <pre><code>GET /rest/v1/contractors</code></pre>
          <pre><code>PATCH /rest/v1/contractors</code></pre>
        </li>
        <li>
          <h4>Projects</h4>
          <p>Handle project creation and management.</p>
          <pre><code>GET /rest/v1/projects</code></pre>
          <pre><code>POST /rest/v1/projects</code></pre>
        </li>
      </ul>

      <h3>Storage API</h3>
      <ul>
        <li>
          <h4>Floor Plan Storage</h4>
          <p>Upload and manage floor plan files.</p>
          <pre><code>POST /storage/v1/floor-plans</code></pre>
        </li>
        <li>
          <h4>Project Documents</h4>
          <p>Store and retrieve project-related documents.</p>
          <pre><code>POST /storage/v1/project-documents</code></pre>
        </li>
      </ul>

      <h3>Rate Limits</h3>
      <p>API requests are limited to:</p>
      <ul>
        <li>1000 requests per hour for authenticated users</li>
        <li>100 requests per hour for unauthenticated users</li>
        <li>Edge functions have specific limits based on complexity</li>
      </ul>
    </div>
  );
}