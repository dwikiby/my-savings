<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create a test user
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Create transactions for the user
        // Create 10 income transactions
        Transaction::factory()
            ->count(10)
            ->income()
            ->for($user)
            ->create();
            
        // Create 20 expense transactions
        Transaction::factory()
            ->count(10)
            ->expense()
            ->for($user)
            ->create();
    }
}
