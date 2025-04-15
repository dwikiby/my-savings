<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;


class DashboardController extends Controller
{
    private const CACHE_TTL = 300;

    public function index(Request $request)
    {
        $userId = Auth::id();
        $period = $request->get('period', 'month');
        $cacheKey = "dashboard_data_{$userId}_{$period}_" . Carbon::now()->format('Y-m-d');

        $dashboardData = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($period) {
            return $this->generateDashboardData($period);
        });

        return Inertia::render('dashboard', $dashboardData);
    }

    private function generateDashboardData($period)
    {
        // Get total savings with cache
        $totalSavings = $this->getTotalSavings();

        // Get current expense with cache
        $currentExpense = $this->getExpenseByPeriod($period);

        // Get current month's transaction count with cache
        $currentMonthTransactions = $this->getCurrentMonthTransactions();

        // Calculate percentage changes with cache
        $savingsChange = $this->calculateSavingsChange();
        $expenseChange = $this->calculateExpenseChange($period);
        $transactionChange = $this->calculateTransactionChange();

        // Get recent transactions with cache
        $recentTransactions = $this->getRecentTransactions();

        return [
            'totalSavings' => [
                'amount' => $totalSavings,
                'percentageChange' => $savingsChange
            ],
            'totalExpense' => [
                'amount' => $currentExpense,
                'percentageChange' => $expenseChange,
                'period' => $period
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

    private function getExpenseByPeriod($period)
    {
        $userId = Auth::id();
        $cacheKey = "expense_{$period}_{$userId}_" . Carbon::now()->format('Y-m-d');

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $period) {
            $query = Transaction::where('user_id', $userId)
                ->where('type', 'expense');

            switch ($period) {
                case 'today':
                    $query->whereDate('transaction_date', Carbon::today());
                    break;
                case 'week':
                    $query->whereBetween('transaction_date', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ]);
                    break;
                case 'month':
                    $query->whereYear('transaction_date', Carbon::now()->year)
                        ->whereMonth('transaction_date', Carbon::now()->month);
                    break;
                case 'year':
                    $query->whereYear('transaction_date', Carbon::now()->year);
                    break;
            }

            return $query->sum('amount');
        });
    }

    private function calculateExpenseChange($period)
    {
        $userId = Auth::id();
        $cacheKey = "expense_change_{$period}_{$userId}_" . Carbon::now()->format('Y-m-d');

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $period) {
            $currentAmount = $this->getExpenseByPeriod($period);
            $previousAmount = $this->getPreviousPeriodExpense($period);

            if ($previousAmount == 0) {
                return 0;
            }

            return round((($currentAmount - $previousAmount) / $previousAmount) * 100, 2);
        });
    }

    private function getPreviousPeriodExpense($period)
    {
        $userId = Auth::id();
        $query = Transaction::where('user_id', $userId)
            ->where('type', 'expense');

        switch ($period) {
            case 'today':
                $query->whereDate('transaction_date', Carbon::yesterday());
                break;
            case 'week':
                $query->whereBetween('transaction_date', [
                    Carbon::now()->subWeek()->startOfWeek(),
                    Carbon::now()->subWeek()->endOfWeek()
                ]);
                break;
            case 'month':
                $query->whereYear('transaction_date', Carbon::now()->subMonth()->year)
                    ->whereMonth('transaction_date', Carbon::now()->subMonth()->month);
                break;
            case 'year':
                $query->whereYear('transaction_date', Carbon::now()->subYear()->year);
                break;
        }

        return $query->sum('amount');
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
