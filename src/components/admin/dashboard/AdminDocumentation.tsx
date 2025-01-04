import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDocumentation() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
        <CardDescription>
          Component and API documentation for Plan Aura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="contractor">Contractor</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <TabsContent value="client" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="contractor" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
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
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
