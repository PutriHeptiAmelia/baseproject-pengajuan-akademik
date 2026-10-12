<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $dosenPa = User::updateOrCreate(
            ['email' => 'dosenpa@example.com'],
            [
                'name' => 'Ir. Gigih Forda Nama, S.T., M.T.I., IPM',
                'password' => Hash::make('password'),
                'nomor_induk' => '198307122008121003',
                'role' => 'dosen_pa',
                'phone' => '081200000001',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'mahasiswa@example.com'],
            [
                'name' => 'Kholifah Wulandari',
                'password' => Hash::make('password'),
                'nomor_induk' => '2415061079',
                'role' => 'mahasiswa',
                'phone' => '081200000002',
                'dosen_pa_id' => $dosenPa->id,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'kaprodi@example.com'],
            [
                'name' => 'Yessi Mulyani, S.T., M.T.',
                'password' => Hash::make('password'),
                'nomor_induk' => '197312262000122001',
                'role' => 'kaprodi',
                'phone' => '081200000003',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'staffakademik@example.com'],
            [
                'name' => 'Indrawati',
                'password' => Hash::make('password'),
                'nomor_induk' => null,
                'role' => 'staff_akademik',
                'phone' => '081200000004',
                'email_verified_at' => now(),
            ]
        );
    }
}
