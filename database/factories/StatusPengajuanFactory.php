<?php

namespace Database\Factories;

use App\Models\StatusPengajuan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StatusPengajuan>
 */
class StatusPengajuanFactory extends Factory
{
    protected $model = StatusPengajuan::class;

    public function definition(): array
    {
        return [
            'kode' => strtoupper(fake()->unique()->lexify('???')),
            'nama' => fake()->randomElement([
                'Menunggu Verifikasi',
                'Diproses',
                'Disetujui',
                'Ditolak',
                'Selesai',
            ]),
            'urutan' => fake()->numberBetween(1, 10),
        ];
    }
}