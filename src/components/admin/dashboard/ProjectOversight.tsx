import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, X, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProjectOversight() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (email),
          project_contracts (status)
        `)
        .order('created_at', { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    }
  })

  const handleBulkApprove = async (selectedIds: string[]) => {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'approved' })
      .in('id', selectedIds)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve projects",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Projects approved successfully",
      })
    }
  }

  const filteredProjects = projects?.filter(project =>
    project.title?.toLowerCase().includes(search.toLowerCase()) ||
    project.profiles?.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <div>Loading projects...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contract Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects?.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.title}</TableCell>
                <TableCell>{project.profiles?.email}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>
                  {project.project_contracts?.[0]?.status || 'No Contract'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkApprove([project.id])}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}