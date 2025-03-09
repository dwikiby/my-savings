import { LineChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TotalTransactionCardProps {
    data: {
        count: number;
        percentageChange: number;
    };
}

export function TotalTransactionCard({ data }: TotalTransactionCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions (This Month)</CardTitle>
                <LineChartIcon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{data.count}</div>
                <div className={`percentage ${data.percentageChange >= 0 ? 'positive' : 'negative'}`}>
                    <p className="text-muted-foreground text-xs">
                        {' '}
                        {data.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(data.percentageChange)}% transactions from last month
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
