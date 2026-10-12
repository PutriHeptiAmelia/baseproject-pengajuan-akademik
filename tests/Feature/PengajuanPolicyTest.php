<?php

use App\Models\Pengajuan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Biar tiap test fresh
});

it('mahasiswa bisa lihat pengajuannya sendiri', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();
    $pengajuan = Pengajuan::factory()->create(['user_id' => $mahasiswa->id]);

    expect($mahasiswa->can('view', $pengajuan))->toBeTrue();
});

it('mahasiswa tidak bisa lihat pengajuan orang lain', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();
    $lain = User::factory()->mahasiswa()->create();
    $pengajuan = Pengajuan::factory()->create(['user_id' => $lain->id]);

    expect($mahasiswa->can('view', $pengajuan))->toBeFalse();
});

it('kaprodi bisa lihat semua pengajuan', function () {
    $kaprodi = User::factory()->kaprodi()->create();
    $pengajuan = Pengajuan::factory()->create();

    expect($kaprodi->can('view', $pengajuan))->toBeTrue();
});

it('staff akademik bisa lihat semua pengajuan', function () {
    $staff = User::factory()->create(['role' => 'staff_akademik']);
    $pengajuan = Pengajuan::factory()->create();

    expect($staff->can('view', $pengajuan))->toBeTrue();
});

it('mahasiswa bisa buat pengajuan', function () {
    $mahasiswa = User::factory()->mahasiswa()->create();

    expect($mahasiswa->can('create', Pengajuan::class))->toBeTrue();
});

it('dosen pa tidak bisa buat pengajuan', function () {
    $dosen = User::factory()->dosenPa()->create();

    expect($dosen->can('create', Pengajuan::class))->toBeFalse();
});

it('cuma kaprodi yang bisa hapus pengajuan', function () {
    $kaprodi = User::factory()->kaprodi()->create();
    $mahasiswa = User::factory()->mahasiswa()->create();
    $pengajuan = Pengajuan::factory()->create();

    expect($kaprodi->can('delete', $pengajuan))->toBeTrue();
    expect($mahasiswa->can('delete', $pengajuan))->toBeFalse();
});

it('dosen pa bisa approve pengajuan mahasiswa bimbingannya', function () {
    $dosen = User::factory()->dosenPa()->create();
    $mahasiswa = User::factory()->mahasiswa()->create([
        'dosen_pa_id' => $dosen->id,
    ]);
    $pengajuan = Pengajuan::factory()->create(['user_id' => $mahasiswa->id]);

    expect($dosen->can('approve', $pengajuan))->toBeTrue();
});

it('dosen pa tidak bisa approve pengajuan bukan bimbingannya', function () {
    $dosen = User::factory()->dosenPa()->create();
    $mahasiswaLain = User::factory()->mahasiswa()->create();
    $pengajuan = Pengajuan::factory()->create(['user_id' => $mahasiswaLain->id]);

    expect($dosen->can('approve', $pengajuan))->toBeFalse();
});

it('staff akademik bisa approve semua pengajuan', function () {
    $staff = User::factory()->create(['role' => 'staff_akademik']);
    $pengajuan = Pengajuan::factory()->create();

    expect($staff->can('approve', $pengajuan))->toBeTrue();
});