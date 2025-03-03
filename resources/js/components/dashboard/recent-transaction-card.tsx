import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatRupiah } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface Transaction {
    id: number;
    date: string;
    name: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
}

export function RecentTransactionCard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { flash } = usePage().props;

    const fetchRecentTransactions = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/recent-transactions?limit=5');

            if (!response.ok) {
                throw new Error('Failed to fetch recent transactions');
            }

            const data = await response.json();
            setTransactions(data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching recent transactions:', err);
            setError('Failed to load recent transactions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentTransactions();
    }, []);

    // Check if a new transaction was added and reload data
    useEffect(() => {
        if (flash.transaction_added) {
            fetchRecentTransactions();
        }
    }, [flash.transaction_added]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-2">
                    {' '}
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your recent financial activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => (window.location.href = '/report')}>
                    View All
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="py-8 text-center text-red-500">{error}</div>
                ) : (
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
                                transactions.map((transaction) => (
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
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                    Export
                </Button>
                <Button variant="outline" size="sm" onClick={fetchRecentTransactions}>
                    Refresh
                </Button>
            </CardFooter>
        </Card>
    );
}
