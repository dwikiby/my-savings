import { RecentTransactionCard } from '@/components/dashboard/recent-transaction-card';
import { TotalExpenseCard } from '@/components/dashboard/total-expense-card';
import { TotalSavingsCard } from '@/components/dashboard/total-savings-card';
import { TotalTransactionCard } from '@/components/dashboard/total-transaction-card';
import { AddTransactionDrawer } from '@/components/transaction/add-transaction-drawer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Transaction {
    id: number;
    date: string;
    name: string;
    category: string;
    type: 'income' | 'expense';
    amount: number;
}

interface DashboardProps {
    totalSavings: {
        amount: number;
        percentageChange: number;
    };
    totalExpense: {
        amount: number;
        percentageChange: number;
    };
    totalTransactions: {
        count: number;
        percentageChange: number;
    };
    recentTransactions: Transaction[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { props } = usePage<{ props: DashboardProps }>();
    const { totalSavings, totalExpense, totalTransactions, recentTransactions } = props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mt-4 mr-4 ml-8 flex justify-between">
                <p className="text-muted-foreground text-sm md:text-base">Overview of your financial activity</p>
                <AddTransactionDrawer />
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Summary cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <TotalSavingsCard data={totalSavings as { amount: number; percentageChange: number }} />
                    <TotalExpenseCard data={totalExpense as { amount: number; percentageChange: number; period?: string | undefined }} />
                    <TotalTransactionCard data={totalTransactions as { count: number; percentageChange: number }} />
                </div>
                {/* Recent Transactions */}
                <RecentTransactionCard transactions={recentTransactions as Transaction[]} />
            </div>
            <div className="fixed right-4 bottom-20 md:hidden">
                <AddTransactionDrawer />
            </div>
        </AppLayout>
    );
}
