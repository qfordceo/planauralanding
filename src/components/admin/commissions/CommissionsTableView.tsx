import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CommissionsTableViewProps {
  purchases: any[]
}

export function CommissionsTableView({ purchases }: CommissionsTableViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Floor Plan</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Commission</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases?.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell>
              {new Date(purchase.purchase_date).toLocaleDateString()}
            </TableCell>
            <TableCell>{purchase.profiles?.email}</TableCell>
            <TableCell>{purchase.floor_plans?.name}</TableCell>
            <TableCell>${purchase.purchase_amount}</TableCell>
            <TableCell>${purchase.commission_amount}</TableCell>
            <TableCell>
              {purchase.commission_paid ? "Paid" : "Pending"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}