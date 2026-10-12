<?php

namespace App\Models;

use Database\Factories\JenisLayananFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisLayanan extends Model
{
    /** @use HasFactory<JenisLayananFactory> */
    use HasFactory;

    protected $table = 'jenis_layanan';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Pengajuan, $this>
     */
    public function pengajuan(): HasMany
    {
        return $this->hasMany(Pengajuan::class, 'jenis_layanan_id');
    }
}
