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
    private const PER_PAGE = 17;
    public function index(Request $request)
    {
        $userId = Auth::id();
        $page = $request->input('page', 1);
        $cacheKey = "report_transaction_{$userId}_page_{$page}";

        $transactions = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($userId) {
            return $this->getTransactions($userId);
        });

        return Inertia::render('report', [
            'transactions' => $transactions
        ]);
    }

    public function getTransactions($userId)
    {
        return Transaction::where('user_id', $userId)
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(self::PER_PAGE)
            ->through(function ($transaction) {
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
