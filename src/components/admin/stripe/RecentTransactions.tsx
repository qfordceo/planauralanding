import { CreditCard } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Transaction {
  id: string
  purchase_date: string
  profiles?: { email: string }
  floor_plans?: { name: string }
  purchase_amount: number
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.slice(0, 5).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.purchase_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.profiles?.email}</TableCell>
                <TableCell>{transaction.floor_plans?.name}</TableCell>
                <TableCell>${transaction.purchase_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}