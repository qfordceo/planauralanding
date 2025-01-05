import { DocumentVersioning } from "@/components/DocumentVersioning/DocumentVersioning";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Document Versioning Demo</h1>
        <DocumentVersioning documentId="demo-document-1" />
      </main>
    </div>
  );
}