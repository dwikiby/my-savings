import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { CartesianGrid, Dot, Line, LineChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from './ui/button';
const chartData = [
    { browser: 'chrome', income: 90, fill: 'var(--color-chrome)' },
    { browser: 'safari', income: 100, fill: 'var(--color-safari)' },
    { browser: 'firefox', income: 187, fill: 'var(--color-firefox)' },
    { browser: 'edge', income: 200, fill: 'var(--color-edge)' },
    { browser: 'other', income: 275, fill: 'var(--color-other)' },
];

const chartConfig = {
    income: {
        label: 'Income',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export function TotalSavingsCard() {
    const [showTotal, setShowTotal] = useState(true);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Total Savings</CardTitle>
                <CardDescription>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                        <p>{showTotal ? 'Rp. 45.000,00' : 'Rp. ******'}</p>
                        <Button variant="ghost" onClick={() => setShowTotal(!showTotal)}>
                            {showTotal ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </Button>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 24,
                            left: 24,
                            right: 24,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" nameKey="income" hideLabel />} />
                        <Line
                            dataKey="income"
                            type="natural"
                            stroke="var(--color-income)"
                            strokeWidth={2}
                            dot={({ payload, ...props }) => {
                                return <Dot key={payload.browser} r={5} cx={props.cx} cy={props.cy} fill={payload.fill} stroke={payload.fill} />;
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
