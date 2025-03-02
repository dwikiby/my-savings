import { formatRupiah } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const currentMonthExpenses = 4459000;

export function TotalExpenseCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
                <CreditCard className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatRupiah(currentMonthExpenses)}</div>
                <p className="text-muted-foreground text-xs">-4.5% from last month</p>
            </CardContent>
        </Card>
    );
}
