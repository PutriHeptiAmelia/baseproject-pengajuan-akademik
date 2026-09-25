<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusPengajuan extends Model
{
    protected $table = 'status_pengajuan';

    public $timestamps = false;

    protected $fillable = [
        'kode',
        'nama',
        'urutan',
    ];

    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class, 'status_pengajuan_id');
    }

    public function persetujuan(): HasMany
    {
        return $this->hasMany(Persetujuan::class, 'status_pengajuan_id');
    }
}
