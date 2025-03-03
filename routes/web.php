<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('report', function () {
        return Inertia::render('report');
    })->name('report');

    // Transactions
    Route::resource('transactions', TransactionController::class);

    // Route for recent transactions
    Route::get('/api/recent-transactions', [TransactionController::class, 'getRecentTransactions'])
        ->name('api.transactions.recent');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
