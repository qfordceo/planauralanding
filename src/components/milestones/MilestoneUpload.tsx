import React, { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { Upload } from "lucide-react"

interface MilestoneUploadProps {
  projectId: string
}

export function MilestoneUpload({ projectId }: MilestoneUploadProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split(".").pop()
      const filePath = `${projectId}/${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("milestone-photos")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      toast({
        title: "Photo uploaded",
        description: "The milestone photo has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the photo.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        id="photo"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <Button
        variant="outline"
        disabled={uploading}
        onClick={() => document.getElementById("photo")?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Progress Photo
      </Button>
    </div>
  )
}