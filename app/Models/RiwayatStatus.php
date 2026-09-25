<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatStatus extends Model
{
    const UPDATED_AT = null;

    protected $table = 'riwayat_status';

    protected $fillable = [
        'pengajuan_id',
        'status_lama_id',
        'status_baru_id',
        'diubah_oleh',
        'catatan',
    ];

    /**
     * @return BelongsTo<Pengajuan, $this>
     */
    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(Pengajuan::class, 'pengajuan_id');
    }

    /**
     * @return BelongsTo<StatusPengajuan, $this>
     */
    public function statusLama(): BelongsTo
    {
        return $this->belongsTo(StatusPengajuan::class, 'status_lama_id');
    }

    /**
     * @return BelongsTo<StatusPengajuan, $this>
     */
    public function statusBaru(): BelongsTo
    {
        return $this->belongsTo(StatusPengajuan::class, 'status_baru_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function pengubah(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diubah_oleh');
    }
}
