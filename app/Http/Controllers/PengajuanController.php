<?php

namespace App\Controllers; // atau namespace App\Http\Controllers; sesuai bawaan proyek

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\JenisLayanan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengajuanController extends Controller
{
    // Week 5: Menampilkan daftar pengajuan dalam bentuk React (Inertia)
    public function index()
    {
        $pengajuans = Pengajuan::with(['pemohon', 'jenisLayanan', 'status'])->latest()->get();

        return Inertia::render('Pengajuan/Index', [
            'pengajuans' => $pengajuans
        ]);
    }

    // Week 4: Menampilkan form tambah (Blade)
    public function create()
    {
        $jenisLayanans = JenisLayanan::where('is_active', true)->get();
        return view('pengajuan.create', compact('jenisLayanans'));
    }

    // Week 4: Menyimpan data baru
    public function store(Request $request)
    {
        $request->validate([
            'jenis_layanan_id' => 'required|exists:jenis_layanan,id',
            'keterangan' => 'nullable|string',
        ]);

        Pengajuan::create([
            'nomor_pengajuan' => 'PJN-' . date('Y') . '-' . rand(100000, 999999),
            'user_id' => auth()->id(), // Mengambil id user yang sedang login
            'jenis_layanan_id' => $request->jenis_layanan_id,
            'status_pengajuan_id' => 1, // Status awal: Menunggu Verifikasi Dosen PA
            'keterangan' => $request->keterangan,
        ]);

        return redirect()->route('pengajuan.index')->with('success', 'Pengajuan berhasil dikirim.');
    }

    // Week 5: Menampilkan detail pengajuan via React
    public function show(Pengajuan $pengajuan)
    {
        $pengajuan->load(['pemohon', 'jenisLayanan', 'status', 'dokumen', 'persetujuan']);

        return Inertia::render('Pengajuan/Show', [
            'pengajuan' => $pengajuan
        ]);
    }
}