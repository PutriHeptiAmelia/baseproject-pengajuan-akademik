<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_pengajuan', 30)->unique();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('jenis_layanan_id')->constrained('jenis_layanan')->restrictOnDelete();
            $table->foreignId('status_pengajuan_id')->constrained('status_pengajuan')->restrictOnDelete();
            $table->text('keterangan')->nullable();
            $table->timestampTz('tanggal_pengajuan')->useCurrent();
            $table->timestampTz('tanggal_selesai')->nullable();
            $table->timestampsTz();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan');
    }
};
