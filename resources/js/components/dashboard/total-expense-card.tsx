import { formatRupiah } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface TotalExpenseCardProps {
    data: {
        amount: number;
        percentageChange: number;
        period?: string;
    };
}

export function TotalExpenseCard({ data }: TotalExpenseCardProps) {
    const [period, setPeriod] = useState(data.period || 'month');

    const handlePeriodChange = (newPeriod: string) => {
        setPeriod(newPeriod);
        router.get(
            route('dashboard'),
            { period: newPeriod },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };
    const getPeriodText = (period: string) => {
        switch (period) {
            case 'today':
                return 'Today';
            case 'week':
                return 'This Week';
            case 'month':
                return 'This Month';
            case 'year':
                return 'This Year';
            default:
                return 'This Month';
        }
    };
    const getPercentageColorClass = (percentage: number) => {
        if (percentage > 0) return 'text-emerald-600 dark:text-emerald-400';
        if (percentage < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400'; // untuk 0%
    };
    const getPercentageIcon = (percentage: number) => {
        if (percentage > 0) return '↑';
        if (percentage < 0) return '↓';
        return null;
    };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses ({getPeriodText(period)})</CardTitle>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <CreditCard className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePeriodChange('today')}>Today</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePeriodChange('week')}>This Week</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePeriodChange('month')}>This Month</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePeriodChange('year')}>This Year</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatRupiah(data.amount)}</div>
                <div className="percentage">
                    <p className={`flex items-center gap-1 text-xs ${getPercentageColorClass(data.percentageChange)}`}>
                        {getPercentageIcon(data.percentageChange) && <span>{getPercentageIcon(data.percentageChange)}</span>}
                        <span>{Math.abs(data.percentageChange)}%</span>
                        <span className="text-muted-foreground">from previous {period}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
