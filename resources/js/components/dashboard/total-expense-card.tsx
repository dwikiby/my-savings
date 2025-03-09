import { formatRupiah } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TotalExpenseCardProps {
    data: {
        amount: number;
        percentageChange: number;
    };
}

export function TotalExpenseCard({ data }: TotalExpenseCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses (This Month)</CardTitle>
                <CreditCard className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatRupiah(data.amount)}</div>
                <div className={`percentage ${data.percentageChange >= 0 ? 'positive' : 'negative'}`}>
                    <p className="text-muted-foreground text-xs">
                        {data.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(data.percentageChange)}% expenses from last month
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
