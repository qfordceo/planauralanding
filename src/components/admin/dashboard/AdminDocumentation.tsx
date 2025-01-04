import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientDocumentation } from "./documentation/ClientDocumentation";
import { ContractorDocumentation } from "./documentation/ContractorDocumentation";
import { ContractsDocumentation } from "./documentation/ContractsDocumentation";
import { ProjectsDocumentation } from "./documentation/ProjectsDocumentation";
import { ApiDocumentation } from "./documentation/ApiDocumentation";

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
            <TabsContent value="client">
              <ClientDocumentation />
            </TabsContent>

            <TabsContent value="contractor">
              <ContractorDocumentation />
            </TabsContent>

            <TabsContent value="contracts">
              <ContractsDocumentation />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsDocumentation />
            </TabsContent>

            <TabsContent value="api">
              <ApiDocumentation />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}