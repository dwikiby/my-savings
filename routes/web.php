<?php

use App\Http\Controllers\Analytics\AnalyticsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Report\ReportController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Transactions
    Route::resource('transactions', TransactionController::class)->only('store', 'show', 'update', 'destroy');
    // Report
    Route::get('report', [ReportController::class, 'index'])->name('report');

    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');
    ;
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
