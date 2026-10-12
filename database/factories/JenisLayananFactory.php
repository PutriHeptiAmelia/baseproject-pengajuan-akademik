<?php

namespace Database\Factories;

use App\Models\JenisLayanan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JenisLayanan>
 */
class JenisLayananFactory extends Factory
{
    protected $model = JenisLayanan::class;

    public function definition(): array
    {
        return [
            'kode' => strtoupper(fake()->unique()->lexify('???')),
            'nama' => fake()->randomElement([
                'Surat Keterangan Aktif Kuliah',
                'Surat Pengantar KP',
                'Legalisir Ijazah',
                'Cuti Akademik',
                'Surat Keterangan Lulus',
            ]),
            'deskripsi' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
