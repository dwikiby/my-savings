<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    private const CACHE_TTL = 300; // 5 minutes in seconds

    public function index()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now()->format('Y-m');

        // Get all dashboard data from cache or generate if not exists
        $dashboardData = Cache::remember("dashboard_data_{$userId}_{$currentMonth}", self::CACHE_TTL, function () {
            return $this->generateDashboardData();
        });

        return Inertia::render('dashboard', $dashboardData);
    }

    private function generateDashboardData()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now();

        // Get total savings with cache
        $totalSavings = $this->getTotalSavings();

        // Get current month's expense with cache
        $currentMonthExpense = $this->getCurrentMonthExpense();

        // Get current month's transaction count with cache
        $currentMonthTransactions = $this->getCurrentMonthTransactions();

        // Calculate percentage changes with cache
        $savingsChange = $this->calculateSavingsChange();
        $expenseChange = $this->calculateExpenseChange();
        $transactionChange = $this->calculateTransactionChange();

        // Get recent transactions with cache
        $recentTransactions = $this->getRecentTransactions();

        return [
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
        ];
    }

    private function getTotalSavings()
    {
        $userId = Auth::id();
        $cacheKey = "total_savings_{$userId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            return Transaction::where('user_id', $userId)
                ->select(DB::raw("COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as total_savings"))
                ->first()
                ->total_savings;
        });
    }

    private function getCurrentMonthExpense()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now()->format('Y-m');
        $cacheKey = "current_month_expense_{$userId}_{$currentMonth}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            $currentMonth = Carbon::now();
            return Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereYear('transaction_date', $currentMonth->year)
                ->whereMonth('transaction_date', $currentMonth->month)
                ->sum('amount');
        });
    }

    private function getCurrentMonthTransactions()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now()->format('Y-m');
        $cacheKey = "current_month_transactions_{$userId}_{$currentMonth}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            $currentMonth = Carbon::now();
            return Transaction::where('user_id', $userId)
                ->whereYear('transaction_date', $currentMonth->year)
                ->whereMonth('transaction_date', $currentMonth->month)
                ->count();
        });
    }

    private function calculateSavingsChange()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now()->format('Y-m');
        $cacheKey = "savings_change_{$userId}_{$currentMonth}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            $currentMonth = Carbon::now();
            $lastMonth = Carbon::now()->subMonth();

            // Current month's savings
            $currentSavings = $this->getMonthSavings($currentMonth);
            $lastSavings = $this->getMonthSavings($lastMonth);

            if ($lastSavings == 0) {
                return $currentSavings > 0 ? 100 : 0;
            }

            return round((($currentSavings - $lastSavings) / abs($lastSavings)) * 100, 2);
        });
    }

    private function getMonthSavings(Carbon $month)
    {
        $userId = Auth::id();
        $monthKey = $month->format('Y-m');
        $cacheKey = "month_savings_{$userId}_{$monthKey}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $month) {
            return Transaction::where('user_id', $userId)
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->select(DB::raw("COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as savings"))
                ->first()
                ->savings;
        });
    }

    private function calculateExpenseChange()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now()->format('Y-m');
        $cacheKey = "expense_change_{$userId}_{$currentMonth}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            $currentMonth = Carbon::now();
            $lastMonth = Carbon::now()->subMonth();

            $currentExpense = $this->getMonthExpense($currentMonth);
            $lastExpense = $this->getMonthExpense($lastMonth);

            if ($lastExpense == 0) {
                return $currentExpense > 0 ? 100 : 0;
            }

            return round((($currentExpense - $lastExpense) / $lastExpense) * 100, 2);
        });
    }

    private function getMonthExpense(Carbon $month)
    {
        $userId = Auth::id();
        $monthKey = $month->format('Y-m');
        $cacheKey = "month_expense_{$userId}_{$monthKey}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $month) {
            return Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->sum('amount');
        });
    }

    private function calculateTransactionChange()
    {
        $userId = Auth::id();
        $currentMonth = Carbon::now()->format('Y-m');
        $cacheKey = "transaction_change_{$userId}_{$currentMonth}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            $currentMonth = Carbon::now();
            $lastMonth = Carbon::now()->subMonth();

            $currentCount = $this->getMonthTransactionCount($currentMonth);
            $lastCount = $this->getMonthTransactionCount($lastMonth);

            if ($lastCount == 0) {
                return $currentCount > 0 ? 100 : 0;
            }

            return round((($currentCount - $lastCount) / $lastCount) * 100, 2);
        });
    }

    private function getMonthTransactionCount(Carbon $month)
    {
        $userId = Auth::id();
        $monthKey = $month->format('Y-m');
        $cacheKey = "month_transaction_count_{$userId}_{$monthKey}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $month) {
            return Transaction::where('user_id', $userId)
                ->whereYear('transaction_date', $month->year)
                ->whereMonth('transaction_date', $month->month)
                ->count();
        });
    }

    private function getRecentTransactions()
    {
        $userId = Auth::id();
        $cacheKey = "recent_transactions_{$userId}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            return Transaction::where('user_id', $userId)
                ->orderBy('transaction_date', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(7)
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
        });
    }
}
