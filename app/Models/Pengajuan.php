<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengajuan extends Model
{
    protected $table = 'pengajuan';

    protected $fillable = [
        'nomor_pengajuan',
        'user_id',
        'jenis_layanan_id',
        'status_pengajuan_id',
        'keterangan',
        'tanggal_pengajuan',
        'tanggal_selesai',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_pengajuan' => 'datetime',
            'tanggal_selesai' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function pemohon(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsTo<JenisLayanan, $this>
     */
    public function jenisLayanan(): BelongsTo
    {
        return $this->belongsTo(JenisLayanan::class, 'jenis_layanan_id');
    }

    /**
     * @return BelongsTo<StatusPengajuan, $this>
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(StatusPengajuan::class, 'status_pengajuan_id');
    }

    /**
     * @return HasMany<DokumenPengajuan, $this>
     */
    public function dokumen(): HasMany
    {
        return $this->hasMany(DokumenPengajuan::class, 'pengajuan_id');
    }

    /**
     * @return HasMany<Persetujuan, $this>
     */
    public function persetujuan(): HasMany
    {
        return $this->hasMany(Persetujuan::class, 'pengajuan_id');
    }

    /**
     * @return HasMany<RiwayatStatus, $this>
     */
    public function riwayatStatus(): HasMany
    {
        return $this->hasMany(RiwayatStatus::class, 'pengajuan_id');
    }
}
