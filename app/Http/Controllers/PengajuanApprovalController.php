<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\StatusPengajuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PengajuanApprovalController extends Controller
{
    // 1. Fungsi Setujui (Dosen, Kaprodi, Admin)
    public function approve(Request $request, Pengajuan $pengajuan)
    {
        if (! Auth::user()->can('approve', $pengajuan)) {
            abort(403);
        }
        $user = Auth::user();

        $statusKode = '';
        if ($user->role === 'dosen_pa') {
            $statusKode = 'diverifikasi_pa';
        } elseif ($user->role === 'kaprodi') {
            $statusKode = 'disetujui_kaprodi';
        } elseif ($user->role === 'admin') {
            $statusKode = 'selesai';
        }

        $statusBaru = StatusPengajuan::where('kode', $statusKode)->first();
        if (! $statusBaru) {
            return back()->with('error', 'Status tidak ditemukan!');
        }

        DB::beginTransaction();
        try {
            $pengajuan->update([
                'status_pengajuan_id' => $statusBaru->id,
                'tanggal_selesai' => $statusKode === 'selesai' ? now() : $pengajuan->tanggal_selesai,
            ]);
            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusBaru->id,
                'diubah_oleh' => $user->id,
                'catatan' => 'Disetujui oleh '.$user->role,
                'created_at' => now(),
            ]);
            DB::commit();

            return back()->with('success', 'Pengajuan berhasil diproses!');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', $e->getMessage());
        }
    }

    // 2. Fungsi Revisi (Hanya Dosen PA)
    public function revisi(Request $request, Pengajuan $pengajuan)
    {
        if (! Auth::user()->can('approve', $pengajuan)) {
            abort(403);
        }
        $statusRevisi = StatusPengajuan::where('kode', 'revisi')->first();

        DB::beginTransaction();
        try {
            $pengajuan->update(['status_pengajuan_id' => $statusRevisi->id]);
            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusRevisi->id,
                'diubah_oleh' => Auth::id(),
                'catatan' => 'Direvisi oleh Dosen PA',
                'created_at' => now(),
            ]);
            DB::commit();

            return back()->with('success', 'Pengajuan dikembalikan untuk revisi.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', $e->getMessage());
        }
    }

    // 3. Fungsi Tolak (Dosen & Kaprodi)
    public function tolak(Request $request, Pengajuan $pengajuan)
    {
        if (! Auth::user()->can('approve', $pengajuan)) {
            abort(403);
        }
        $statusTolak = StatusPengajuan::where('kode', 'ditolak')->first();

        DB::beginTransaction();
        try {
            $pengajuan->update([
                'status_pengajuan_id' => $statusTolak->id,
                'tanggal_selesai' => now(),
            ]);
            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusTolak->id,
                'diubah_oleh' => Auth::id(),
                'catatan' => 'Ditolak oleh '.Auth::user()->role,
                'created_at' => now(),
            ]);
            DB::commit();

            return back()->with('success', 'Pengajuan telah ditolak.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', $e->getMessage());
        }
    }
}
