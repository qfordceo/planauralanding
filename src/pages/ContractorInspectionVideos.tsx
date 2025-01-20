import { VideoUpload } from "@/components/contractor/inspection/VideoUpload";
import { VideoList } from "@/components/contractor/inspection/VideoList";

export default function ContractorInspectionVideos() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Inspection Videos</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Upload New Video</h2>
          <VideoUpload />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
          <VideoList />
        </section>
      </div>
    </div>
  );
}