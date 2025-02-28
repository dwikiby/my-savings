'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
    { month: 'January', income: 186, expense: 80 },
    { month: 'February', income: 305, expense: 200 },
    { month: 'March', income: 237, expense: 120 },
    { month: 'April', income: 73, expense: 190 },
    { month: 'May', income: 209, expense: 130 },
    { month: 'June', income: 214, expense: 140 },
];

const chartConfig = {
    income: {
        label: 'Income',
        color: 'hsl(var(--chart-1))',
    },
    expense: {
        label: 'Expense',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

export function MultipleChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Chart - Savings</CardTitle>
                <CardDescription>January - June 2025</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                        <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total savings for the last 6 months</div>
            </CardFooter>
        </Card>
    );
}
