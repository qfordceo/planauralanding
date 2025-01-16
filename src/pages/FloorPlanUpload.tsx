import { FloorPlanScraper } from "@/components/FloorPlanScraper";

export default function FloorPlanUpload() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Your Floor Plan</h1>
      <FloorPlanScraper />
    </div>
  );
}