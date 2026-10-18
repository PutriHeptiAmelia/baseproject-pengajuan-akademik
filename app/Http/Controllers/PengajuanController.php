<?php

namespace App\Http\Controllers;

use App\Models\JenisLayanan;
use App\Models\Pengajuan;
use App\Models\StatusPengajuan;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanController extends Controller
{
    // Week 5: Menampilkan daftar pengajuan dalam bentuk React (Inertia)
    public function index(Request $request): Response
    {
        $user = $request->user();
        $query = Pengajuan::with(['pemohon', 'jenisLayanan', 'status'])->latest();

        if ($user && $user->role === 'mahasiswa') {
            $query->where('user_id', $user->id);
        } elseif ($user && $user->role === 'dosen_pa') {
            $query->whereHas('pemohon', fn ($q) => $q->where('dosen_pa_id', $user->id));
        }

        $pengajuans = $query->get();

        return Inertia::render('Pengajuan/Index', [
            'pengajuans' => $pengajuans,
            'role' => $user?->role ?? 'mahasiswa',
        ]);
    }

    // Week 4: Menampilkan form tambah (Blade)
    public function create(): View
    {
        $jenisLayanans = JenisLayanan::where('is_active', true)->get();

        return view('pengajuan.create', compact('jenisLayanans'));
    }

    // Week 4: Menyimpan data baru
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'jenis_layanan_id' => 'required|exists:jenis_layanan,id',
            'keterangan' => 'nullable|string',
        ]);

        Pengajuan::create([
            'nomor_pengajuan' => 'PJN-'.date('Y').'-'.rand(100000, 999999),
            'user_id' => auth()->id(), // Mengambil id user yang sedang login
            'jenis_layanan_id' => $request->jenis_layanan_id,
            'status_pengajuan_id' => 1, // Status awal: Menunggu Verifikasi Dosen PA
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan berhasil dikirim.');
    }

    public function ajukanUlang(Request $request, Pengajuan $pengajuan)
    {
        // Pastikan hanya pemilik pengajuan yang bisa ajukan ulang
        if (Auth::id() !== $pengajuan->user_id) {
            abort(403);
        }

        // Pastikan statusnya memang 'revisi'
        if ($pengajuan->status->kode !== 'revisi') {
            return back()->with('error', 'Pengajuan ini tidak dalam status revisi.');
        }

        // Cari ID status 'diajukan' atau 'menunggu_verifikasi_pa'
        $statusDiajukan = StatusPengajuan::where('kode', 'diajukan')->first();

        DB::beginTransaction();
        try {
            // Update status kembali ke diajukan
            $pengajuan->update([
                'status_pengajuan_id' => $statusDiajukan->id,
                // Update keterangan kalau mahasiswa nambahin catatan baru
                'keterangan' => $request->keterangan ?? $pengajuan->keterangan,
            ]);

            // Catat di riwayat status
            DB::table('riwayat_status')->insert([
                'pengajuan_id' => $pengajuan->id,
                'status_lama_id' => $pengajuan->status_pengajuan_id,
                'status_baru_id' => $statusDiajukan->id,
                'diubah_oleh' => Auth::id(),
                'catatan' => 'Mahasiswa mengajukan ulang setelah revisi',
                'created_at' => now(),
            ]);

            DB::commit();

            return back()->with('success', 'Pengajuan berhasil diajukan ulang! Menunggu verifikasi Dosen PA.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Terjadi kesalahan: '.$e->getMessage());
        }
    }

    // Week 5: Menampilkan detail pengajuan via React
    public function show(Pengajuan $pengajuan): Response
    {
        $pengajuan->load(['pemohon', 'jenisLayanan', 'status', 'dokumen', 'persetujuan.approver']);

        return Inertia::render('Pengajuan/Show', [
            'pengajuan' => $pengajuan,
        ]);
    }
}
