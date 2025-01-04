import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { AlertTriangle } from "lucide-react"

interface ContractorReassignmentProps {
  projectId: string
  currentContractorId: string
}

export function ContractorReassignment({ projectId, currentContractorId }: ContractorReassignmentProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isReassigning, setIsReassigning] = useState(false)

  const { data: availableContractors } = useQuery({
    queryKey: ['available-contractors', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractors')
        .select(`
          id,
          business_name,
          average_rating,
          contractor_badges (badge_type)
        `)
        .neq('id', currentContractorId)
        .eq('stripe_account_enabled', true)
        .order('average_rating', { ascending: false })

      if (error) throw error
      return data
    },
  })

  const reassignmentMutation = useMutation({
    mutationFn: async (newContractorId: string) => {
      // Update project tasks
      const { error: tasksError } = await supabase
        .from('project_tasks')
        .update({ assigned_contractor_id: newContractorId })
        .eq('project_id', projectId)
        .eq('assigned_contractor_id', currentContractorId)

      if (tasksError) throw tasksError

      // Update timeline agreement
      const { error: agreementError } = await supabase
        .from('timeline_agreements')
        .update({ contractor_id: newContractorId })
        .eq('project_id', projectId)
        .eq('contractor_id', currentContractorId)

      if (agreementError) throw agreementError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks'] })
      queryClient.invalidateQueries({ queryKey: ['timeline-agreements'] })
      toast({
        title: "Contractor reassigned successfully",
        description: "All tasks have been transferred to the new contractor.",
      })
      setIsReassigning(false)
    },
    onError: (error) => {
      toast({
        title: "Error reassigning contractor",
        description: "Failed to reassign tasks. Please try again.",
        variant: "destructive",
      })
      console.error("Reassignment error:", error)
    },
  })

  if (!isReassigning) {
    return (
      <Button 
        variant="outline" 
        onClick={() => setIsReassigning(true)}
        className="w-full"
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Consider Contractor Reassignment
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contractor Reassignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Reassigning a contractor will transfer all pending tasks to the new contractor.
            Make sure to review their qualifications carefully.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {availableContractors?.map((contractor) => (
            <Card key={contractor.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{contractor.business_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Rating: {contractor.average_rating?.toFixed(1) || "New"}
                  </p>
                </div>
                <Button
                  onClick={() => reassignmentMutation.mutate(contractor.id)}
                  disabled={reassignmentMutation.isPending}
                >
                  Select Contractor
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => setIsReassigning(false)}
          className="w-full"
        >
          Cancel Reassignment
        </Button>
      </CardContent>
    </Card>
  )
}