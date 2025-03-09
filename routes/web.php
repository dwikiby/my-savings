<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Dashboard\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // API routes for dashboard cards
    Route::prefix('api/dashboard')->name('api.dashboard.')->group(function () {
        Route::get('total-savings', [DashboardController::class, 'getTotalSavings'])->name('total-savings');
        Route::get('total-expense', [DashboardController::class, 'getTotalExpense'])->name('total-expense');
        Route::get('total-transactions', [DashboardController::class, 'getTotalTransactions'])->name('total-transactions');
    });


    // Transactions
    Route::resource('transactions', TransactionController::class);

    // Route for recent transactions
    Route::get('/api/recent-transactions', [TransactionController::class, 'getRecentTransactions'])
        ->name('api.transactions.recent');

    // Route for Report
    Route::get('/report', function () {
        return Inertia::render('report');
    })->name('report');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
