<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'nomor_induk',
        'role',
        'phone',
        'dosen_pa_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi Mahasiswa ke Dosen PA-nya
    public function dosenPa(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dosen_pa_id');
    }

    // Relasi Dosen PA ke daftar Mahasiswa bimbingannya
    public function mahasiswaBimbingan(): HasMany
    {
        return $this->hasMany(User::class, 'dosen_pa_id');
    }

    // Relasi ke pengajuan yang dibuat mahasiswa
    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class, 'user_id');
    }

    // Relasi ke keputusan persetujuan yang diberikan
    public function persetujuan(): HasMany
    {
        return $this->hasMany(Persetujuan::class, 'approver_id');
    }

    // Relasi ke riwayat perubahan status yang dilakukan
    public function riwayatStatus(): HasMany
    {
        return $this->hasMany(RiwayatStatus::class, 'diubah_oleh');
    }
}
