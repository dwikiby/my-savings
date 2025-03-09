<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $currentMonth = Carbon::now();

        // Get total savings (all time)
        $totalSavings = Transaction::where('user_id', Auth::id())
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE -amount END), 0) as total_savings'))
            ->first()
            ->total_savings;

        // Get current month's expense
        $currentMonthExpense = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->whereYear('transaction_date', $currentMonth->year)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->sum('amount');

        // Get current month's transaction count
        $currentMonthTransactions = Transaction::where('user_id', Auth::id())
            ->whereYear('transaction_date', $currentMonth->year)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->count();

        // Calculate percentage changes
        $savingsChange = $this->calculateSavingsChange();
        $expenseChange = $this->calculateExpenseChange();
        $transactionChange = $this->calculateTransactionChange();

        // Get recent transactions
        $recentTransactions = Transaction::where('user_id', Auth::id())
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'date' => $transaction->transaction_date,
                    'name' => $transaction->description,
                    'category' => $transaction->category,
                    'type' => $transaction->type,
                    'amount' => $transaction->amount,
                ];
            });

        return Inertia::render('dashboard', [
            'totalSavings' => [
                'amount' => $totalSavings,
                'percentageChange' => $savingsChange
            ],
            'totalExpense' => [
                'amount' => $currentMonthExpense,
                'percentageChange' => $expenseChange
            ],
            'totalTransactions' => [
                'count' => $currentMonthTransactions,
                'percentageChange' => $transactionChange
            ],
            'recentTransactions' => $recentTransactions
        ]);
    }

    private function calculateSavingsChange()
    {
        $currentMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Current month's savings
        $currentSavings = Transaction::where('user_id', Auth::id())
            ->whereYear('transaction_date', $currentMonth->year)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE -amount END), 0) as savings'))
            ->first()
            ->savings;

        // Last month's savings
        $lastSavings = Transaction::where('user_id', Auth::id())
            ->whereYear('transaction_date', $lastMonth->year)
            ->whereMonth('transaction_date', $lastMonth->month)
            ->select(DB::raw('COALESCE(SUM(CASE WHEN type = "income" THEN amount ELSE -amount END), 0) as savings'))
            ->first()
            ->savings;

        if ($lastSavings == 0) {
            return $currentSavings > 0 ? 100 : 0;
        }

        return round((($currentSavings - $lastSavings) / abs($lastSavings)) * 100, 2);
    }

    private function calculateExpenseChange()
    {
        $currentMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Current month's expense
        $currentExpense = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->whereYear('transaction_date', $currentMonth->year)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->sum('amount');

        // Last month's expense
        $lastExpense = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->whereYear('transaction_date', $lastMonth->year)
            ->whereMonth('transaction_date', $lastMonth->month)
            ->sum('amount');

        if ($lastExpense == 0) {
            return $currentExpense > 0 ? 100 : 0;
        }

        return round((($currentExpense - $lastExpense) / $lastExpense) * 100, 2);
    }

    private function calculateTransactionChange()
    {
        $currentMonth = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        // Current month's transaction count
        $currentCount = Transaction::where('user_id', Auth::id())
            ->whereYear('transaction_date', $currentMonth->year)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->count();

        // Last month's transaction count
        $lastCount = Transaction::where('user_id', Auth::id())
            ->whereYear('transaction_date', $lastMonth->year)
            ->whereMonth('transaction_date', $lastMonth->month)
            ->count();

        if ($lastCount == 0) {
            return $currentCount > 0 ? 100 : 0;
        }

        return round((($currentCount - $lastCount) / $lastCount) * 100, 2);
    }
}
