<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    private const CACHE_TTL = 300;
    public function index()
    {
        $userId = Auth::id();
        $cacheKey = "report_transaction_{$userId}";

        $recentTransactions = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            return $this->getRecentTransactions($userId);
        });

        $recentTransactions = $recentTransactions->toArray();

        return Inertia::render('report', [
            'transactions' => $recentTransactions,
        ]);
    }

    public function getRecentTransactions($userId)
    {
        return Transaction::where('user_id', $userId)
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(17)
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
    }
}
