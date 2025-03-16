<?php

namespace App\Observers;

use App\Models\Transaction;
use Illuminate\Support\Facades\Cache;

class TransactionObserver
{
    private function clearUserCache($userId)
    {
        $currentMonth = now()->format('Y-m');

        // Clear all related caches
        Cache::forget("dashboard_data_{$userId}_{$currentMonth}");
        Cache::forget("total_savings_{$userId}");
        Cache::forget("current_month_expense_{$userId}_{$currentMonth}");
        Cache::forget("current_month_transactions_{$userId}_{$currentMonth}");
        Cache::forget("savings_change_{$userId}_{$currentMonth}");
        Cache::forget("expense_change_{$userId}_{$currentMonth}");
        Cache::forget("transaction_change_{$userId}_{$currentMonth}");
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