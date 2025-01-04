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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="contractor">Contractor</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
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
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}