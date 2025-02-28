'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
    { browser: 'chrome', expense: 187, fill: 'var(--color-chrome)' },
    { browser: 'safari', expense: 200, fill: 'var(--color-safari)' },
    { browser: 'firefox', expense: 275, fill: 'var(--color-firefox)' },
    { browser: 'edge', expense: 173, fill: 'var(--color-edge)' },
    { browser: 'other', expense: 90, fill: 'var(--color-other)' },
];

const chartConfig = {
    expense: {
        label: 'Expense',
    },
    chrome: {
        label: 'Transportasi',
        color: 'hsl(var(--chart-1))',
    },
    safari: {
        label: 'Investasi',
        color: 'hsl(var(--chart-2))',
    },
    firefox: {
        label: 'Makan Minum',
        color: 'hsl(var(--chart-3))',
    },
    edge: {
        label: 'Hiburan',
        color: 'hsl(var(--chart-4))',
    },
    other: {
        label: 'Lainnya',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

export function ExpenseChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense Chart</CardTitle>
                <CardDescription>January - June 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="browser"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar
                            dataKey="expense"
                            strokeWidth={2}
                            radius={8}
                            activeIndex={2}
                            activeBar={({ ...props }) => {
                                return (
                                    <Rectangle {...props} fillOpacity={0.8} stroke={props.payload.fill} strokeDasharray={4} strokeDashoffset={4} />
                                );
                            }}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total expenses for the last 6 months</div>
            </CardFooter>
        </Card>
    );
}
