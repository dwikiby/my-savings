import { formatRupiah } from '@/lib/utils';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const currentMonthSavings = 35000000 - 4459000;

export function TotalSavingsCard() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Savings (This Month)</CardTitle>
                <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{formatRupiah(currentMonthSavings)}</div>
                <p className="text-muted-foreground text-xs">+20.1% from last month</p>
            </CardContent>
        </Card>
    );
}
