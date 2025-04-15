'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRupiah } from '@/lib/utils';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Custom tooltip formatter for charts
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background rounded-lg border p-2 shadow-sm">
                <div className="grid grid-cols-1 gap-2">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-[0.70rem] uppercase">{label}</span>
                        {payload.map((entry: any, index: number) => (
                            <span key={`item-${index}`} className="text-sm font-bold" style={{ color: entry.color }}>
                                {entry.name}: {formatRupiah(entry.value)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

interface ExpenseTrendChartProps {
    data: Array<{ month: string; amount: number } | { day: string; amount: number }>;
    period: string;
}

export function ExpenseTrendChart({ data, period }: ExpenseTrendChartProps) {
    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Tren Pengeluaran {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}</CardTitle>
                <CardDescription>
                    {period === 'weekly'
                        ? 'Pengeluaran per hari dalam seminggu terakhir'
                        : period === 'monthly'
                          ? 'Pengeluaran per bulan dalam setahun'
                          : 'Pengeluaran per tahun'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 5, bottom: 20, left: 5 }}>
                            <XAxis dataKey={period === 'weekly' ? 'day' : 'month'} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => formatRupiah(value)}
                                width={80}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} name="Pengeluaran" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
