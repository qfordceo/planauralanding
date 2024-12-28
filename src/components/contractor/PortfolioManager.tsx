import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PortfolioForm } from "./portfolio/PortfolioForm";
import { PortfolioGrid } from "./portfolio/PortfolioGrid";
import { usePortfolioManager } from "./portfolio/usePortfolioManager";

export function PortfolioManager({ contractorId }: { contractorId: string }) {
  const {
    portfolioItems,
    isLoading,
    isUploading,
    handleSubmit,
    handleDelete,
  } = usePortfolioManager(contractorId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Portfolio Item</CardTitle>
          <CardDescription>
            Showcase your completed projects to potential clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioForm onSubmit={handleSubmit} isUploading={isUploading} />
        </CardContent>
      </Card>

      <PortfolioGrid items={portfolioItems} onDelete={handleDelete} />
    </div>
  );
}