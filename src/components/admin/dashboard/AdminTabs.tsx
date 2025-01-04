import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientDocumentation } from "./documentation/ClientDocumentation";
import { ContractorDocumentation } from "./documentation/ContractorDocumentation";
import { ApiDocumentation } from "./documentation/ApiDocumentation";
import { UserGuides } from "./documentation/UserGuides";

export function AdminTabs() {
  return (
    <Tabs defaultValue="client" className="w-full">
      <TabsList>
        <TabsTrigger value="client">Client Components</TabsTrigger>
        <TabsTrigger value="contractor">Contractor Components</TabsTrigger>
        <TabsTrigger value="api">API Documentation</TabsTrigger>
        <TabsTrigger value="guides">User Guides</TabsTrigger>
      </TabsList>

      <TabsContent value="client">
        <ClientDocumentation />
      </TabsContent>

      <TabsContent value="contractor">
        <ContractorDocumentation />
      </TabsContent>

      <TabsContent value="api">
        <ApiDocumentation />
      </TabsContent>

      <TabsContent value="guides">
        <UserGuides />
      </TabsContent>
    </Tabs>
  );
}