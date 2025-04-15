import { AverageExpenseCard } from '@/components/analytics/average-expense-card';
import { FilterSection } from '@/components/analytics/filter-section';
import { ExpenseChart } from '@/components/chart/expense-chart';
import { MultipleChart } from '@/components/chart/multiple-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface AnalyticsProps {
    averageExpense: {
        amount: number;
        percentageChange: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Analytics',
        href: '/analytics',
    },
];

export default function Analytics() {
    const { props } = usePage<{ props: AnalyticsProps }>();
    const { averageExpense } = props;
    const [period, setPeriod] = useState('monthly');
    const [year, setYear] = useState('2025');

    const handleFilterChange = (newPeriod: string, newYear: string) => {
        setPeriod(newPeriod);
        setYear(newYear);

        router.get(
            route('analytics'),
            { period: newPeriod, year: newYear },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePeriodChange = (newPeriod: string) => {
        handleFilterChange(newPeriod, year);
    };

    const handleYearChange = (newYear: string) => {
        handleFilterChange(period, newYear);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <FilterSection period={period} year={year} onPeriodChange={handlePeriodChange} onYearChange={handleYearChange} />
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <AverageExpenseCard data={averageExpense as { amount: number; percentageChange: number; period?: string | undefined }} />
                    <MultipleChart />
                    <ExpenseChart />
                </div>
                <MultipleChart />
            </div>
        </AppLayout>
    );
}
