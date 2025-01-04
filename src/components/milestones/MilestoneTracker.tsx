import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { MilestoneList } from "./MilestoneList"
import { MilestoneUpload } from "./MilestoneUpload"
import { MilestoneProgress } from "./MilestoneProgress"

interface MilestoneTrackerProps {
  projectId: string
}

export function MilestoneTracker({ projectId }: MilestoneTrackerProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: milestones, isLoading } = useQuery({
    queryKey: ["project-milestones", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_milestones")
        .select(`
          *,
          contractors:assigned_contractor_id (
            business_name,
            contact_name
          )
        `)
        .eq("build_estimate_id", projectId)
        .order("created_at", { ascending: true })

      if (error) throw error
      return data
    },
  })

  const approveMilestoneMutation = useMutation({
    mutationFn: async (milestoneId: string) => {
      const { error } = await supabase
        .from("project_milestones")
        .update({
          approval_status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", milestoneId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-milestones"] })
      toast({
        title: "Milestone approved",
        description: "The milestone has been marked as approved.",
      })
    },
  })

  if (isLoading) {
    return <div>Loading milestones...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Milestones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MilestoneProgress milestones={milestones || []} />
        <MilestoneList
          milestones={milestones || []}
          onApprove={(id) => approveMilestoneMutation.mutate(id)}
        />
        <MilestoneUpload projectId={projectId} />
      </CardContent>
    </Card>
  )
}