import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
          {report.status === 'resolved' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : report.status === 'pending_review' ? (
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          Clash Detection Report
        </CardTitle>
        <CardDescription>
          Analysis completed on {new Date(report.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <pre className="whitespace-pre-wrap text-sm">
            {report.analysis_results}
          </pre>
        </div>
        {report.resolution_notes && (
          <div className="rounded-lg bg-green-50 p-4">
            <h4 className="font-medium text-green-900">Resolution Notes</h4>
            <p className="mt-1 text-green-700">{report.resolution_notes}</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Download report functionality
              const reportData = JSON.stringify(report, null, 2)
              const blob = new Blob([reportData], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `clash-report-${report.id}.json`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
          >
            Download Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}