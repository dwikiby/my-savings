<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     */
    public function getRecentTransactions(Request $request)
{
    $limit = $request->input('limit', 5);
    
    $recentTransactions = Transaction::where('user_id', Auth::id())
        ->orderBy('transaction_date', 'desc')
        ->orderBy('created_at', 'desc')
        ->limit($limit)
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
    
    return response()->json([
        'data' => $recentTransactions
    ]);
}
    public function index(Request $request)
    {
        $query = Transaction::where('user_id', Auth::id());

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('transaction_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('transaction_date', '<=', $request->end_date);
        }

        // Sort by date (default: newest first)
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy('transaction_date', $sortDirection);

        // Paginate results
        $perPage = $request->input('per_page', 15);
        $transactions = $query->paginate($perPage);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['type', 'category', 'start_date', 'end_date', 'sort_direction']),
        ]);
    }
    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'transaction_date' => 'required|date',
            'remember_category' => 'boolean',
        ]);

        // Remove remember_category from data to be saved
        $remember = $validated['remember_category'] ?? false;
        unset($validated['remember_category']);

        // Add user_id to the data
        $validated['user_id'] = Auth::id();

        // Create the transaction
        $transaction = Transaction::create($validated);

        // Set a flag to indicate a new transaction was added
        return redirect()->route('dashboard')
            ->with('success', 'Transaction added successfully')
            ->with('transaction_added', true);
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction)
    {
        // Check if the transaction belongs to the authenticated user
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the specified transaction.
     */
    public function edit(Transaction $transaction)
    {
        // Check if the transaction belongs to the authenticated user
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Update the specified transaction in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        // Check if the transaction belongs to the authenticated user
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'transaction_date' => 'required|date',
        ]);

        $transaction->update($validated);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction updated successfully');
    }

    /**
     * Remove the specified transaction from storage.
     */
    public function destroy(Transaction $transaction)
    {
        // Check if the transaction belongs to the authenticated user
        if ($transaction->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction deleted successfully');
    }

    /**
     * Get transaction summary/statistics.
     */
    public function summary(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Total income
        $totalIncome = Transaction::where('user_id', Auth::id())
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // Total expense
        $totalExpense = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // Expenses by category
        $expensesByCategory = Transaction::where('user_id', Auth::id())
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->selectRaw('category, sum(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Transactions/Summary', [
            'summary' => [
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'balance' => $totalIncome - $totalExpense,
                'expenses_by_category' => $expensesByCategory,
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
            ],
            'filters' => $request->only(['start_date', 'end_date']),
        ]);
    }
}