import { LineChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const recentTransactions = [
    {
        id: '1',
        date: '2023-05-01',
        name: 'Grocery Store',
        amount: -1205000,
        category: 'Food',
        type: 'expense',
    },
    {
        id: '2',
        date: '2023-05-02',
        name: 'Salary Deposit',
        amount: 35000000,
        category: 'Income',
        type: 'income',
    },
    {
        id: '3',
        date: '2023-05-03',
        name: 'Electric Bill',
        amount: -852000,
        category: 'Utilities',
        type: 'expense',
    },
    {
        id: '4',
        date: '2023-05-04',
        name: 'Freelance Payment',
        amount: 4500000,
        category: 'Income',
        type: 'income',
    },
    {
        id: '5',
        date: '2023-05-05',
        name: 'Restaurant',
        amount: -653000,
        category: 'Food',
        type: 'expense',
    },
    {
        id: '6',
        date: '2023-05-06',
        name: 'Gas Station',
        amount: -450000,
        category: 'Transportation',
        type: 'expense',
    },
    {
        id: '7',
        date: '2023-05-07',
        name: 'Online Shopping',
        amount: -1299000,
        category: 'Shopping',
        type: 'expense',
    },
];

const currentMonthTransactions = recentTransactions.length;

export function TotalTransactionCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions (This Month)</CardTitle>
                <LineChartIcon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{currentMonthTransactions}</div>
                <p className="text-muted-foreground text-xs">+12 transactions from last month</p>
            </CardContent>
        </Card>
    );
}
