import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { differenceInDays, format } from "date-fns"

interface TimelineComparisonProps {
  projectId: string
}

export function TimelineComparison({ projectId }: TimelineComparisonProps) {
  const { data: timelineData } = useQuery({
    queryKey: ['timeline-comparison', projectId],
    queryFn: async () => {
      const { data: milestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select(`
          id,
          title,
          due_date,
          status,
          contractor_submission_date,
          client_approval_date
        `)
        .eq('build_estimate_id', projectId)
        .order('due_date', { ascending: true })

      if (milestonesError) throw milestonesError

      const { data: agreement, error: agreementError } = await supabase
        .from('timeline_agreements')
        .select('agreed_completion_date')
        .eq('project_id', projectId)
        .single()

      if (agreementError) throw agreementError

      return {
        milestones,
        agreedCompletionDate: agreement?.agreed_completion_date
      }
    }
  })

  if (!timelineData?.milestones) return null

  const completedMilestones = timelineData.milestones.filter(m => m.status === 'completed')
  const progressPercentage = (completedMilestones.length / timelineData.milestones.length) * 100

  const chartData = timelineData.milestones.map(milestone => {
    const plannedDuration = milestone.due_date ? 
      differenceInDays(new Date(milestone.due_date), new Date(timelineData.milestones[0].due_date)) : 0
    
    const actualDuration = milestone.contractor_submission_date ?
      differenceInDays(new Date(milestone.contractor_submission_date), new Date(timelineData.milestones[0].due_date)) : plannedDuration

    return {
      name: milestone.title,
      planned: plannedDuration,
      actual: actualDuration,
    }
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Timeline Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="planned" name="Planned Duration" fill="#8884d8" />
              <Bar dataKey="actual" name="Actual Duration" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {timelineData.agreedCompletionDate && (
          <div className="text-sm text-muted-foreground">
            Agreed Completion Date: {format(new Date(timelineData.agreedCompletionDate), 'PPP')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}