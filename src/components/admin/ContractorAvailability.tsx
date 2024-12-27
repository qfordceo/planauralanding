import { useQuery } from "@tanstack/react-query"
import { Calendar } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export function ContractorAvailability() {
  const { data: availability, isLoading } = useQuery({
    queryKey: ["contractor-availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contractor_availability")
        .select(`
          *,
          contractors (
            business_name,
            contact_name,
            phone
          )
        `)
        .order("day_of_week", { ascending: true })

      if (error) throw error
      return data
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Contractor Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contractor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availability?.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.contractors?.business_name}</TableCell>
                <TableCell>
                  {slot.contractors?.contact_name}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {slot.contractors?.phone}
                  </span>
                </TableCell>
                <TableCell>{DAYS[slot.day_of_week]}</TableCell>
                <TableCell>{slot.start_time}</TableCell>
                <TableCell>{slot.end_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}