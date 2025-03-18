import { formatRupiah } from '@/lib/utils';
import { DollarSign, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TotalSavingsCardProps {
    data: {
        amount: number;
        percentageChange: number;
    };
}

export function TotalSavingsCard({ data }: TotalSavingsCardProps) {
    const [show, setShow] = useState(false);

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
            <CardHeader className="mt-3 flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Savings (This Month)</CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center text-2xl font-bold">
                    {show ? formatRupiah(data.amount) : 'Rp. ---'}
                    {show ? (
                        <EyeOff className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setShow(false)} />
                    ) : (
                        <Eye className="ml-2 h-4 w-4 cursor-pointer" onClick={() => setShow(true)} />
                    )}
                </div>
                <div className="percentage">
                    <p className={`flex items-center gap-1 text-xs ${getPercentageColorClass(data.percentageChange)}`}>
                        {getPercentageIcon(data.percentageChange) && <span>{getPercentageIcon(data.percentageChange)}</span>}
                        <span>{Math.abs(data.percentageChange)}%</span>
                        <span className="text-muted-foreground">from previous month</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
