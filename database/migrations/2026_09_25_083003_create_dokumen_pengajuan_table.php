<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dokumen_pengajuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_id')->constrained('pengajuan')->cascadeOnDelete();
            $table->string('nama_file', 255);
            $table->string('path_file', 255);
            $table->string('tipe_file', 50)->nullable();
            $table->integer('ukuran_file');
            $table->timestampTz('created_at')->useCurrent();
        });

        DB::statement('ALTER TABLE dokumen_pengajuan ADD CONSTRAINT chk_dokumen_ukuran CHECK (ukuran_file >= 0)');
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumen_pengajuan');
    }
};
