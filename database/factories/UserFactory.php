<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'nomor_induk' => fake()->unique()->numerify('##########'),
            'role' => 'mahasiswa',
            'phone' => fake()->numerify('08##########'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function mahasiswa(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'mahasiswa']);
    }

    public function dosenPa(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'dosen_pa']);
    }

    public function kaprodi(): static
    {
        return $this->state(fn (array $attributes) => ['role' => 'kaprodi']);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'nomor_induk' => null,
        ]);
    }
}
