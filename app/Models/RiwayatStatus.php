<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatStatus extends Model
{
    protected $table = 'riwayat_status';

    const UPDATED_AT = null;

    protected $fillable = [
        'pengajuan_id',
        'status_lama_id',
        'status_baru_id',
        'diubah_oleh',
        'catatan',
    ];

    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(Pengajuan::class, 'pengajuan_id');
    }

    public function statusLama(): BelongsTo
    {
        return $this->belongsTo(StatusPengajuan::class, 'status_lama_id');
    }

    public function statusBaru(): BelongsTo
    {
        return $this->belongsTo(StatusPengajuan::class, 'status_baru_id');
    }

    public function pengubah(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diubah_oleh');
    }
}
