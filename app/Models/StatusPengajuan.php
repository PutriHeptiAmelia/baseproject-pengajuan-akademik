<?php

namespace App\Models;

use Database\Factories\StatusPengajuanFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusPengajuan extends Model
{
    /** @use HasFactory<StatusPengajuanFactory> */
    use HasFactory;

    protected $table = 'status_pengajuan';

    public $timestamps = false;

    protected $fillable = [
        'kode',
        'nama',
        'urutan',
    ];

    /**
     * @return HasMany<Pengajuan, $this>
     */
    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class, 'status_pengajuan_id');
    }

    /**
     * @return HasMany<Persetujuan, $this>
     */
    public function persetujuan(): HasMany
    {
        return $this->hasMany(Persetujuan::class, 'status_pengajuan_id');
    }
}
