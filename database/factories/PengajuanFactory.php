<?php

namespace Database\Factories;

use App\Models\JenisLayanan;
use App\Models\Pengajuan;
use App\Models\StatusPengajuan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengajuan>
 */
class PengajuanFactory extends Factory
{
    protected $model = Pengajuan::class;

    public function definition(): array
    {
        return [
            'nomor_pengajuan' => 'PJN-'.date('Y').'-'.fake()->unique()->numerify('######'),
            'user_id' => User::factory()->mahasiswa(),
            'jenis_layanan_id' => JenisLayanan::factory(),
            'status_pengajuan_id' => StatusPengajuan::factory(),
            'keterangan' => fake()->sentence(),
            'tanggal_pengajuan' => now(),
        ];
    }
}
