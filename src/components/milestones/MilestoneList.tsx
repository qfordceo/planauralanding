import React from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  due_date: string
  status: string
  approval_status: string
  contractors?: {
    business_name: string
    contact_name: string
  }
}

interface MilestoneListProps {
  milestones: Milestone[]
  onApprove: (id: string) => void
}

export function MilestoneList({ milestones, onApprove }: MilestoneListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Milestone</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {milestones.map((milestone) => (
          <TableRow key={milestone.id}>
            <TableCell>
              <div>
                <p className="font-medium">{milestone.title}</p>
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
              </div>
            </TableCell>
            <TableCell>
              {milestone.contractors?.business_name || "Unassigned"}
            </TableCell>
            <TableCell>
              {new Date(milestone.due_date).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(milestone.status)}
                <span className="capitalize">{milestone.status}</span>
              </div>
            </TableCell>
            <TableCell>
              {milestone.status === "completed" &&
                milestone.approval_status === "pending" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onApprove(milestone.id)}
                  >
                    Approve
                  </Button>
                )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}