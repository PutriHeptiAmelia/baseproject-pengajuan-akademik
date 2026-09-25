<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Persetujuan extends Model
{
    protected $table = 'persetujuan';

    public $timestamps = false;

    protected $fillable = [
        'pengajuan_id',
        'approver_id',
        'status_pengajuan_id',
        'keputusan',
        'catatan',
        'tanggal_keputusan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_keputusan' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Pengajuan, $this>
     */
    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(Pengajuan::class, 'pengajuan_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /**
     * @return BelongsTo<StatusPengajuan, $this>
     */
    public function statusPengajuan(): BelongsTo
    {
        return $this->belongsTo(StatusPengajuan::class, 'status_pengajuan_id');
    }
}
