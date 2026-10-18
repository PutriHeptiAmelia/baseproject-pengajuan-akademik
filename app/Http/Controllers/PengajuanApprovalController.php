<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\Persetujuan;
use App\Models\StatusPengajuan; // Pastikan model Persetujuan sudah ada
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PengajuanApprovalController extends Controller
{
    public function approve(Request $request, Pengajuan $pengajuan)
    {
        if (! Auth::user()->can('approve', $pengajuan)) {
            abort(403, 'Anda tidak berhak menyetujui pengajuan ini.');
        }

        $user = Auth::user();
        $statusBaru = null;

        // Nentuin status selanjutnya berdasarkan siapa yang nge-klik
        if ($user->role === 'dosen_pa') {
            $statusBaru = StatusPengajuan::where('kode', 'diverifikasi_pa')->first();
        } elseif ($user->role === 'kaprodi') {
            $statusBaru = StatusPengajuan::where('kode', 'disetujui_kaprodi')->first();
        } elseif ($user->role === 'admin') {
            $statusBaru = StatusPengajuan::where('kode', 'selesai')->first(); // Atau 'diproses_staff' sesuai alur
        }

        if (! $statusBaru) {
            return back()->with('error', 'Status tujuan tidak ditemukan di database!');
        }

        DB::beginTransaction();
        try {
            $pengajuan->update([
                'status_pengajuan_id' => $statusBaru->id,
                'tanggal_selesai' => $statusBaru->kode === 'selesai' ? now() : $pengajuan->tanggal_selesai,
            ]);

            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusBaru->id,
                'diubah_oleh' => $user->id,
                'catatan' => 'Disetujui oleh '.str_replace('_', ' ', $user->role),
                'created_at' => now(),
            ]);

            DB::commit();

            return back()->with('success', 'Pengajuan berhasil diverifikasi!');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Terjadi kesalahan: '.$e->getMessage());
        }
    }

    public function revisi(Request $request, Pengajuan $pengajuan)
    {
        // 1. Cek Izin pakai Policy
        if (! Auth::user()->can('approve', $pengajuan)) {
            abort(403, 'Anda tidak berhak merevisi pengajuan ini.');
        }

        // 2. Cari ID status "revisi" dari database
        $statusRevisi = StatusPengajuan::where('kode', 'revisi')->first();

        if (! $statusRevisi) {
            return back()->with('error', 'Status "revisi" tidak ditemukan di database!');
        }

        DB::beginTransaction();
        try {
            // 3. Update status di tabel pengajuan
            $pengajuan->update([
                'status_pengajuan_id' => $statusRevisi->id,
            ]);

            // 4. Catat ke tabel riwayat_status
            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusRevisi->id,
                'diubah_oleh' => Auth::id(),
                'catatan' => 'Dikembalikan untuk direvisi oleh Dosen PA',
                'created_at' => now(),
            ]);

            DB::commit();

            return back()->with('success', 'Pengajuan dikembalikan ke Mahasiswa untuk direvisi.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Terjadi kesalahan: '.$e->getMessage());
        }
    }

    public function tolak(Request $request, Pengajuan $pengajuan)
    {
        // 1. Cek Izin pakai Policy
        if (! Auth::user()->can('approve', $pengajuan)) {
            abort(403, 'Anda tidak berhak menolak pengajuan ini.');
        }

        // 2. Cari ID status "ditolak" dari database
        $statusDitolak = StatusPengajuan::where('kode', 'ditolak')->first();

        if (! $statusDitolak) {
            return back()->with('error', 'Status "ditolak" tidak ditemukan di database!');
        }

        DB::beginTransaction();
        try {
            // 3. Update status di tabel pengajuan
            $pengajuan->update([
                'status_pengajuan_id' => $statusDitolak->id,
                'tanggal_selesai' => now(), // Opsional: tandai tanggal selesai
            ]);

            // 4. Catat ke tabel riwayat_status
            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusDitolak->id,
                'diubah_oleh' => Auth::id(),
                'catatan' => 'Pengajuan ditolak oleh Dosen PA',
                'created_at' => now(),
            ]);

            DB::commit();

            return back()->with('success', 'Pengajuan telah ditolak.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Terjadi kesalahan: '.$e->getMessage());
        }
    }
}
