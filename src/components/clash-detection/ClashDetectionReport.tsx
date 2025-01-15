import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ClashStatusIcon } from "./components/ClashStatusIcon"
import { AnalysisResults } from "./components/AnalysisResults"
import { DownloadButton } from "./components/DownloadButton"

interface ClashDetectionReportProps {
  modelId?: string
}

export function ClashDetectionReport({ modelId }: ClashDetectionReportProps) {
  const { toast } = useToast()

  const { data: report, isLoading } = useQuery({
    queryKey: ['clash-report', modelId],
    queryFn: async () => {
      if (!modelId) return null

      const { data, error } = await supabase
        .from('clash_detection_reports')
        .select('*')
        .eq('id', modelId)
        .single()

      if (error) {
        toast({
          title: "Error loading clash report",
          description: error.message,
          variant: "destructive",
        })
        throw error
      }

      return data
    },
    enabled: !!modelId
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Clash Report...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Clash Report Available</CardTitle>
          <CardDescription>
            Run a clash detection analysis to view potential issues.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClashStatusIcon status={report.status} />
          Clash Detection Report
        </CardTitle>
        <CardDescription>
          Analysis completed on {new Date(report.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnalysisResults 
          results={report.analysis_results}
          resolutionNotes={report.resolution_notes}
        />
        <div className="flex justify-end gap-2">
          <DownloadButton report={report} />
        </div>
      </CardContent>
    </Card>
  )
}