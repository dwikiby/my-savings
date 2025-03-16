import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Report',
        href: '/report',
    },
];

interface Transaction {
    id: number;
    date: string;
    name: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
}

interface RecentTransactionCardProps {
    transactions: Transaction[];
}

export default function Report({ transactions }: RecentTransactionCardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="space-y-2">
                        <CardTitle>Report</CardTitle>
                        <CardDescription>All your financial transactions</CardDescription>
                    </div>
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
                            {transactions.length > 0 ? (
                                transactions.map((transaction: any) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{format(new Date(transaction.date), 'dd MMM yyyy')}</TableCell>
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-muted-foreground py-6 text-center">
                                        No transactions found. Add your first transaction!
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}
