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
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
                <p className="text-muted-foreground text-xs">
                    {data.percentageChange >= 0 ? '↑' : '↓'} {Math.abs(data.percentageChange)}% from last month
                </p>
            </CardContent>
        </Card>
    );
}
