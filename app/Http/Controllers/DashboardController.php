<?php

namespace App\Http\Controllers;

use App\Models\Pengajuan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $role = $user->role ?? 'mahasiswa';

        if ($role === 'mahasiswa') {
            $baseQuery = Pengajuan::query()->where('user_id', $user->id);

            $stats = [
                'total' => (clone $baseQuery)->count(),
                'menunggu' => (clone $baseQuery)->whereIn('status_pengajuan_id', [1, 3, 4, 5])->count(),
                'selesai' => (clone $baseQuery)->where('status_pengajuan_id', 6)->count(),
                'revisi' => (clone $baseQuery)->whereIn('status_pengajuan_id', [2, 7])->count(),
            ];

            $recentPengajuans = (clone $baseQuery)
                ->with(['pemohon', 'jenisLayanan', 'status'])
                ->latest()
                ->take(5)
                ->get();

            $dosenPa = $user->dosenPa;

            return Inertia::render('dashboard', [
                'role' => 'mahasiswa',
                'stats' => $stats,
                'recentPengajuans' => $recentPengajuans,
                'extra' => [
                    'dosenPa' => $dosenPa ? [
                        'name' => $dosenPa->name,
                        'nip' => $dosenPa->nomor_induk,
                        'email' => $dosenPa->email,
                    ] : null,
                ],
            ]);
        }

        if ($role === 'dosen_pa') {
            $bimbinganQuery = Pengajuan::query()->whereHas('pemohon', fn ($q) => $q->where('dosen_pa_id', $user->id));

            $antreanVerifikasiCount = (clone $bimbinganQuery)->where('status_pengajuan_id', 1)->count();
            $totalBimbinganMahasiswa = User::where('dosen_pa_id', $user->id)->count();
            $sudahDiverifikasiCount = (clone $bimbinganQuery)->where('status_pengajuan_id', '!=', 1)->count();

            // Antrean berkas yang butuh verifikasi Dosen PA diprioritaskan
            $antreanPengajuans = (clone $bimbinganQuery)
                ->where('status_pengajuan_id', 1)
                ->with(['pemohon', 'jenisLayanan', 'status', 'dokumen'])
                ->latest()
                ->take(6)
                ->get();

            if ($antreanPengajuans->isEmpty()) {
                $antreanPengajuans = (clone $bimbinganQuery)
                    ->with(['pemohon', 'jenisLayanan', 'status'])
                    ->latest()
                    ->take(5)
                    ->get();
            }

            $mahasiswaBimbinganList = User::where('dosen_pa_id', $user->id)
                ->select(['id', 'name', 'nomor_induk', 'email'])
                ->take(5)
                ->get();

            return Inertia::render('dashboard', [
                'role' => 'dosen_pa',
                'stats' => [
                    'antrean' => $antreanVerifikasiCount,
                    'totalMahasiswa' => $totalBimbinganMahasiswa,
                    'diverifikasi' => $sudahDiverifikasiCount,
                    'totalPengajuan' => (clone $bimbinganQuery)->count(),
                ],
                'recentPengajuans' => $antreanPengajuans,
                'extra' => [
                    'antreanCount' => $antreanVerifikasiCount,
                    'mahasiswaBimbingan' => $mahasiswaBimbinganList,
                ],
            ]);
        }

        if ($role === 'kaprodi') {
            $baseQuery = Pengajuan::query();

            // Status 3: Menunggu Persetujuan Kaprodi
            $antreanKaprodiCount = (clone $baseQuery)->where('status_pengajuan_id', 3)->count();
            $totalPengajuanProdi = (clone $baseQuery)->count();
            $disetujuiCount = (clone $baseQuery)->whereIn('status_pengajuan_id', [4, 5, 6])->count();
            $ditolakCount = (clone $baseQuery)->where('status_pengajuan_id', 7)->count();

            // Prioritaskan pengajuan yang sedang menunggu persetujuan Kaprodi (status 3)
            $antreanPengajuans = (clone $baseQuery)
                ->where('status_pengajuan_id', 3)
                ->with(['pemohon', 'jenisLayanan', 'status', 'dokumen'])
                ->latest()
                ->take(6)
                ->get();

            if ($antreanPengajuans->isEmpty()) {
                $antreanPengajuans = (clone $baseQuery)
                    ->with(['pemohon', 'jenisLayanan', 'status'])
                    ->latest()
                    ->take(5)
                    ->get();
            }

            return Inertia::render('dashboard', [
                'role' => 'kaprodi',
                'stats' => [
                    'antrean' => $antreanKaprodiCount,
                    'totalProdi' => $totalPengajuanProdi,
                    'disetujui' => $disetujuiCount,
                    'ditolak' => $ditolakCount,
                ],
                'recentPengajuans' => $antreanPengajuans,
                'extra' => [
                    'antreanCount' => $antreanKaprodiCount,
                ],
            ]);
        }

        // Role 'admin' -> Staff Administrasi Akademik
        $baseQuery = Pengajuan::query();

        // Status 4: Menunggu Pemrosesan Staff Akademik
        // Status 5: Sedang Diproses Staff Akademik
        // Status 6: Selesai
        $antreanStaffCount = (clone $baseQuery)->where('status_pengajuan_id', 4)->count();
        $sedangProsesCount = (clone $baseQuery)->where('status_pengajuan_id', 5)->count();
        $selesaiCount = (clone $baseQuery)->where('status_pengajuan_id', 6)->count();
        $totalPengajuan = (clone $baseQuery)->count();

        // Antrean untuk staff: yang berstatus 4 & 5
        $antreanPengajuans = (clone $baseQuery)
            ->whereIn('status_pengajuan_id', [4, 5])
            ->with(['pemohon', 'jenisLayanan', 'status', 'dokumen'])
            ->latest()
            ->take(6)
            ->get();

        if ($antreanPengajuans->isEmpty()) {
            $antreanPengajuans = (clone $baseQuery)
                ->with(['pemohon', 'jenisLayanan', 'status'])
                ->latest()
                ->take(5)
                ->get();
        }

        return Inertia::render('dashboard', [
            'role' => 'admin',
            'stats' => [
                'antrean' => $antreanStaffCount,
                'sedangProses' => $sedangProsesCount,
                'selesai' => $selesaiCount,
                'total' => $totalPengajuan,
            ],
            'recentPengajuans' => $antreanPengajuans,
            'extra' => [
                'antreanCount' => $antreanStaffCount,
            ],
        ]);
    }
}
