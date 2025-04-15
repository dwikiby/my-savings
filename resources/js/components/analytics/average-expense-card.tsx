import { formatRupiah } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AverageExpenseCard {
    data: {
        amount: number;
        percentageChange: number;
        period?: string;
    };
}

export function AverageExpenseCard({ data }: AverageExpenseCard) {
    const getPercentageColorClass = (percentage: number) => {
        if (percentage > 0) return 'text-emerald-600 dark:text-emerald-400';
        if (percentage < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const getPercentageIcon = (percentage: number) => {
        if (percentage > 0) return '↑';
        if (percentage < 0) return '↓';
        return null;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Expenses</CardTitle>
                <CreditCard className="h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatRupiah(data.amount)}</div>
                <div className="percentage">
                    <p className={`flex items-center gap-1 text-xs ${getPercentageColorClass(data.percentageChange)}`}>
                        {getPercentageIcon(data.percentageChange) && <span>{getPercentageIcon(data.percentageChange)}</span>}
                        <span>{Math.abs(data.percentageChange)}%</span>
                        <span className="text-muted-foreground">from previous period</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
