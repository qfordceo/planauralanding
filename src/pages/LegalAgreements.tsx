import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultingAgreement } from "@/components/legal/ConsultingAgreement";
import { ContractorAgreement } from "@/components/legal/ContractorAgreement";
import { LiabilityWaiver } from "@/components/legal/LiabilityWaiver";
import { WarrantyAgreement } from "@/components/legal/WarrantyAgreement";

export default function LegalAgreements() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Legal Agreements</h1>
      
      <Tabs defaultValue="consulting" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="consulting">Consulting</TabsTrigger>
          <TabsTrigger value="contractor">Contractor</TabsTrigger>
          <TabsTrigger value="liability">Liability</TabsTrigger>
          <TabsTrigger value="warranty">Warranty</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consulting">
          <ConsultingAgreement />
        </TabsContent>
        
        <TabsContent value="contractor">
          <ContractorAgreement />
        </TabsContent>
        
        <TabsContent value="liability">
          <LiabilityWaiver />
        </TabsContent>
        
        <TabsContent value="warranty">
          <WarrantyAgreement />
        </TabsContent>
      </Tabs>
    </div>
  );
}