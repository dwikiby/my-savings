<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['income', 'expense'];
        $type = $this->faker->randomElement($types);
        
        $categories = [
            'income' => ['Salary', 'Freelance', 'Investments', 'Other Income'],
            'expense' => ['Food', 'Transportation', 'Utilities', 'Shopping', 'Entertainment', 'Other Expenses']
        ];
        
        return [
            'user_id' => User::factory(),
            'type' => $type,
            'category' => $this->faker->randomElement($categories[$type]),
            'amount' => $this->faker->numberBetween(10000, 5000000),
            'description' => $this->faker->sentence(),
            'transaction_date' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    /**
     * Indicate that the transaction is an income.
     */
    public function income()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'income',
                'category' => $this->faker->randomElement(['Salary', 'Freelance', 'Investments', 'Other Income']),
            ];
        });
    }
    
    /**
     * Indicate that the transaction is an expense.
     */
    public function expense()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'expense',
                'category' => $this->faker->randomElement(['Food', 'Transportation', 'Utilities', 'Shopping', 'Entertainment', 'Other Expenses']),
            ];
        });
    }
}
