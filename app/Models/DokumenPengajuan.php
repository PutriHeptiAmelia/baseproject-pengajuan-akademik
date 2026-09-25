<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumenPengajuan extends Model
{
    const UPDATED_AT = null;

    protected $table = 'dokumen_pengajuan';

    protected $fillable = [
        'pengajuan_id',
        'nama_file',
        'path_file',
        'tipe_file',
        'ukuran_file',
    ];

    /**
     * @return BelongsTo<Pengajuan, $this>
     */
    public function pengajuan(): BelongsTo
    {
        return $this->belongsTo(Pengajuan::class, 'pengajuan_id');
    }
}
