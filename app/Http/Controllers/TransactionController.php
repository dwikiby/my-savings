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

        $remember = $validated['remember_category'] ?? false;
        unset($validated['remember_category']);

        $validated['user_id'] = Auth::id();

        // Create the transaction
        $transaction = Transaction::create($validated);

        // Get the previous URL
        $previousUrl = url()->previous();
        $urlComponents = parse_url($previousUrl);

        $period = 'month'; // default period
        if (isset($urlComponents['query'])) {
            parse_str($urlComponents['query'], $params);
            if (isset($params['period'])) {
                $period = $params['period'];
            }
        }
        // Set a flag to indicate a new transaction was added
        return redirect()->route('dashboard', ['period' => $period])
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
     * Update the specified transaction in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
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
}