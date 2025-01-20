import { Button } from "@/components/ui/button";
import { Download, Image, Box } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExportControlsProps {
  onExport: (format: string) => void;
}

export function ExportControls({ onExport }: ExportControlsProps) {
  return (
    <div className="p-4 space-y-4 bg-background rounded-lg border">
      <h3 className="font-semibold">Export Options</h3>
      
      <div className="space-y-4">
        <Select onValueChange={onExport}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gltf">GLTF/GLB</SelectItem>
            <SelectItem value="obj">OBJ</SelectItem>
            <SelectItem value="fbx">FBX</SelectItem>
            <SelectItem value="png">PNG Render</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}