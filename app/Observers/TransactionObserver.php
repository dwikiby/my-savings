<?php

namespace App\Observers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Cache;

class TransactionObserver
{
    private function clearUserCache($userId)
    {
        $currentDate = now()->format('Y-m-d');
        $periods = ['today', 'week', 'month', 'year'];

        foreach ($periods as $period) {
            Cache::forget("dashboard_data_{$userId}_{$period}_{$currentDate}");
            Cache::forget("expense_{$period}_{$userId}_{$currentDate}");
            Cache::forget("expense_change_{$period}_{$userId}_{$currentDate}");
        }

        // Clear other related caches
        Cache::forget("total_savings_{$userId}");
        Cache::forget("current_month_transactions_{$userId}_{$currentDate}");
        Cache::forget("savings_change_{$userId}_{$currentDate}");
        Cache::forget("transaction_change_{$userId}_{$currentDate}");
        Cache::forget("recent_transactions_{$userId}");
        Cache::forget("report_transaction_{$userId}");
    }

    public function created(Transaction $transaction)
    {
        $this->clearUserCache($transaction->user_id);
    }

    public function updated(Transaction $transaction)
    {
        $this->clearUserCache($transaction->user_id);
    }

    public function deleted(Transaction $transaction)
    {
        $this->clearUserCache($transaction->user_id);
    }

    public function restored(Transaction $transaction)
    {
        $this->clearUserCache($transaction->user_id);
    }
}