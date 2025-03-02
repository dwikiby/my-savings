import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { recentTransactions } from './total-transaction-card';
export function RecentTransactionCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-2">
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your recent financial activity</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                    View All
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.name}</TableCell>
                                <TableCell>
                                    <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'}>{transaction.category}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span
                                        className={
                                            transaction.type === 'income'
                                                ? 'flex items-center justify-end text-green-500'
                                                : 'flex items-center justify-end text-red-500'
                                        }
                                    >
                                        {transaction.type === 'income' ? (
                                            <ArrowUp className="mr-1 h-4 w-4" />
                                        ) : (
                                            <ArrowDown className="mr-1 h-4 w-4" />
                                        )}
                                        {formatRupiah(Math.abs(transaction.amount))}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                    Export
                </Button>
            </CardFooter>
        </Card>
    );
}
