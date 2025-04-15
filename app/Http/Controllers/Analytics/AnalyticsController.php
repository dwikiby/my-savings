<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AnalyticsController extends Controller
{
    private const CACHE_TTL = 300;
    public function index(Request $request)
    {
        $userId = Auth::id();
        $period = $request->get('period', 'monthly');
        $year = $request->get('year', Carbon::now()->year);
        $cacheKey = "analytics_data_{$userId}_{$period}_" . Carbon::now()->format('Y-m-d');

        $cacheKey = "analytics_data_{$userId}_{$period}_{$year}_" . Carbon::now()->format('Y-m-d');

        $analyticsData = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($period, $year) {
            return $this->generateAnalyticsData($period, $year);
        });

        return Inertia::render('analytics', $analyticsData);
    }

    private function generateAnalyticsData($period, $year)
    {
        $averageExpense = $this->getAverageExpense($period, $year);
        $averageExpenseChange = $this->calculateAverageExpenseChange($period, $year);
        return [
            'averageExpense' => [
                'amount' => $averageExpense,
                'percentageChange' => $averageExpenseChange,
                'period' => $period
            ],
        ];
    }

    private function calculateAverageExpenseChange($period, $year)
    {
        $userId = Auth::id();
        $cacheKey = "average_expense_change_{$period}_{$year}_{$userId}_" . Carbon::now()->format('Y-m-d');

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $period, $year) {
            $currentPeriodData = $this->getPeriodExpenseData($period, $year, 'current');
            $previousPeriodData = $this->getPeriodExpenseData($period, $year, 'previous');

            if ($previousPeriodData['count'] == 0) {
                return 0;
            }

            $currentAverage = $currentPeriodData['count'] > 0
                ? ($currentPeriodData['total'] / $currentPeriodData['count'])
                : 0;
            $previousAverage = $previousPeriodData['total'] / $previousPeriodData['count'];

            return $previousAverage > 0
                ? round((($currentAverage - $previousAverage) / $previousAverage) * 100, 2)
                : ($currentAverage > 0 ? 100 : 0);
        });
    }

    private function getPeriodExpenseData($period, $year, $type = 'current')
    {
        $userId = Auth::id();
        $yearInt = (int) $year;

        $query = Transaction::where('user_id', $userId)
            ->where('type', 'expense');

        switch ($period) {
            case 'today':
                if ($type === 'current') {
                    $query->whereDate('transaction_date', Carbon::today());
                } else {
                    $query->whereDate('transaction_date', Carbon::yesterday());
                }
                break;
            case 'weekly':
                if ($type === 'current') {
                    $query->whereBetween('transaction_date', [
                        Carbon::now()->setYear($yearInt)->startOfWeek(),
                        Carbon::now()->setYear($yearInt)->endOfWeek()
                    ]);
                } else {
                    $query->whereBetween('transaction_date', [
                        Carbon::now()->setYear($yearInt)->subWeek()->startOfWeek(),
                        Carbon::now()->setYear($yearInt)->subWeek()->endOfWeek()
                    ]);
                }
                break;
            case 'monthly':
                if ($type === 'current') {
                    $query->whereYear('transaction_date', $yearInt)
                        ->whereMonth('transaction_date', Carbon::now()->month);
                } else {
                    $previousMonth = Carbon::now()->subMonth();
                    $query->whereYear('transaction_date', $previousMonth->year)
                        ->whereMonth('transaction_date', $previousMonth->month);
                }
                break;
            case 'yearly':
                if ($type === 'current') {
                    $query->whereYear('transaction_date', $yearInt);
                } else {
                    $query->whereYear('transaction_date', $yearInt - 1);
                }
                break;
        }

        $result = $query->select([
            DB::raw('COALESCE(SUM(amount), 0) as total'),
            DB::raw('COUNT(*) as count')
        ])->first();

        return [
            'total' => (float) $result->total,
            'count' => (int) $result->count
        ];
    }

    private function getAverageExpense($period, $year)
    {
        $userId = Auth::id();
        $cacheKey = "average_expense_{$period}_{$year}_{$userId}_" . Carbon::now()->format('Y-m-d');

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId, $period, $year) {
            $query = Transaction::where('user_id', $userId)
                ->where('type', 'expense');

            if ($period !== 'today') {
                $query->whereYear('transaction_date', (int) $year);
            }

            $this->applyPeriodFilter($query, $period, $year);

            $result = $query->select(DB::raw('COALESCE(AVG(amount), 0) as average'))
                ->first();

            return round($result->average, 2);
        });
    }

    private function applyPeriodFilter($query, $period, $year)
    {
        $yearInt = (int) $year;

        switch ($period) {
            case 'today':
                $query->whereDate('transaction_date', Carbon::today());
                break;
            case 'weekly':
                $query->whereBetween('transaction_date', [
                    Carbon::now()->setYear($yearInt)->startOfWeek(),
                    Carbon::now()->setYear($yearInt)->endOfWeek()
                ]);
                break;
            case 'monthly':
                $query->whereYear('transaction_date', $yearInt)
                    ->whereMonth('transaction_date', Carbon::now()->month);
                break;
            case 'yearly':
                $query->whereYear('transaction_date', $yearInt);
                break;
        }
    }
}
