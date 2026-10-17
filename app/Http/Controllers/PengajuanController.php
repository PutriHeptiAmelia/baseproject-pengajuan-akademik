<?php

namespace App\Http\Controllers;

use App\Models\JenisLayanan;
use App\Models\Pengajuan;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    // Week 5: Menampilkan detail pengajuan via React
    public function show(Pengajuan $pengajuan): Response
    {
        $pengajuan->load(['pemohon', 'jenisLayanan', 'status', 'dokumen', 'persetujuan.approver']);

        return Inertia::render('Pengajuan/Show', [
            'pengajuan' => $pengajuan,
        ]);
    }
}
