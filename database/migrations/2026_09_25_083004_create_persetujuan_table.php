<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persetujuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_id')->constrained('pengajuan')->cascadeOnDelete();
            $table->foreignId('approver_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('status_pengajuan_id')->constrained('status_pengajuan')->restrictOnDelete();
            $table->string('keputusan', 20);
            $table->text('catatan')->nullable();
            $table->timestampTz('tanggal_keputusan')->useCurrent();
        });

        DB::statement("ALTER TABLE persetujuan ADD CONSTRAINT chk_persetujuan_keputusan CHECK (keputusan IN ('setuju', 'tolak', 'revisi'))");
    }

    public function down(): void
    {
        Schema::dropIfExists('persetujuan');
    }
};
